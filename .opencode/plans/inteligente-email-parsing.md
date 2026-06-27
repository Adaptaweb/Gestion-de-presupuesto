# Plan de Implementación: Arquitectura Inteligente para Parsing de Correos Bancarios

## Resumen Ejecutivo

Este plan implementa la arquitectura descrita en `Arquitectura Inteligente para la Clasificación de Correos Bancarios.md`, enfocándose en las mejoras de mayor impacto para incrementar la precisión del parsing de transacciones bancarias desde correos electrónicos.

**Estado actual del sistema**:

| Componente | Archivo | Estado |
|------------|---------|--------|
| Parser principal | `transactionParser.js` | ✅ Funcionando |
| Fallback IA | `openrouterParser.js` | ✅ Usando OpenRouter (gpt-oss-120b:free) |
| Backup IA | `geminiParser.js` | ⚠️ No se usa actualmente |
| Categorización | `transactionParser.js:CATEGORY_RULES` | ✅ 40+ reglas keywords |
| Detección banco | `transactionParser.js:detectBank()` | ✅ Por dominio + content |

**Modelo actual de IA**: OpenRouter con `openai/gpt-oss-120b:free`

**Issues detectados**:
- ⚠️ Bug en `openrouterParser.js:118-121`: variable `jsonMatch` no definida (usada sin ser asignada)
- ⚠️ No hay sistema de confianza
- ⚠️ No hay fingerprinting de plantillas
- ⚠️ No hay repositorio de ejemplos

**Meta**: Incrementar accuracy de ~70-80% a >95% con aprendizaje continuo.

---

## FASE 1: Sistema de Confianza y Validación (Semana 1)

### 1.1 Nueva tabla para tracking de parsing

```sql
-- Agregar a supabase-schema.sql
CREATE TABLE parsing_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  email_id TEXT,
  banco_detectado TEXT,
  fingerprint_hash TEXT,
  parsing_exitoso BOOLEAN,
  campos_extraidos JSONB,  -- {monto: true, fecha: true, comercio: true}
  confianza_score REAL,    -- 0.0 a 1.0
  metodo_extraccion TEXT,  -- 'tabla' | 'regex' | 'gemini'
  gemini_fallback BOOLEAN DEFAULT FALSE,
  usuario_corrijo BOOLEAN DEFAULT FALSE,
  correccion_categoria TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_parsing_logs_user ON parsing_logs(user_id);
CREATE INDEX idx_parsing_logs_fingerprint ON parsing_logs(fingerprint_hash);
```

### 1.2 Función de cálculo de confianza

**Archivo**: `server/transactionParser.js`

```javascript
function calcularConfianza({ bancoDetectado, montoTabla, fechaTabla, comercioConocido, geminiFallback, categoriaUsuario }) {
  let score = 0;

  if (bancoDetectado) score += 0.15;
  if (montoTabla) score += 0.25;
  if (fechaTabla) score += 0.15;
  if (comercioConocido) score += 0.20;
  if (!geminiFallback) score += 0.10;
  if (categoriaUsuario) score += 0.15;

  return Math.min(score, 1.0);
}

// Threshold para decisión
const UMBRAL_AUTO_GUARDAR = 0.80;
const UMBRAL_REVISION = 0.50;
```

### 1.3 Modificar parseHTML para retornar score

El parser actual retorna `{ banco, tipo_movimiento, ... }`. Agregar campo `confianza`.

---

## FASE 2: Fingerprinting de Plantillas (Semana 2)

### 2.1 Nueva tabla de plantillas

```sql
CREATE TABLE plantillas_email (
  id SERIAL PRIMARY KEY,
  banco TEXT NOT NULL,
  tipo_correo TEXT NOT NULL,  -- 'compra_debito' | 'transferencia' | etc
  fingerprint_hash TEXT NOT NULL,
  asunto_normalizado TEXT,
  estructura_html_hash TEXT,  -- hash de estructura DOM
  parser_nombre TEXT,         -- 'ParserBCI.debito'
  count_uso INT DEFAULT 0,
  count_exitoso INT DEFAULT 0,
  count_fallido INT DEFAULT 0,
  ultimo_uso TIMESTAMP,
  ejemplo_html TEXT,          -- primer ejemplo (para debugging)
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(banco, fingerprint_hash)
);

CREATE INDEX idx_plantillas_banco ON plantillas_email(banco);
CREATE INDEX idx_plantillas_fingerprint ON plantillas_email(fingerprint_hash);
```

### 2.2 Función de fingerprinting

**Archivo**: `server/fingerprint.js` (nuevo)

```javascript
import * as cheerio from 'cheerio';
import crypto from 'crypto';

function normalizarAsunto(asunto) {
  if (!asunto) return '';
  return asunto
    .toLowerCase()
    .replace(/\d{2}\/\d{2}\/\d{4}/g, '<FECHA>')
    .replace(/\$[\d.,]+/g, '<MONTO>')
    .replace(/\b[\d]{4,}\b/g, '<NUM>')
    .replace(/[^\w\s<>]/g, '')
    .trim();
}

function extraerEstructuraHtml(html) {
  const $ = cheerio.load(html);
  return {
    tableCount: $('table').length,
    trCount: $('tr').length,
    tdCount: $('td').length,
    hasMonto: /monto|valor|amount/i.test(html),
    hasFecha: /fecha|date/i.test(html),
    hasComercio: /comercio|establecimiento|merchant/i.test(html),
    hasTarjeta: /tarjeta|card/i.test(html),
  };
}

function generarFingerprint(html, subject) {
  const estructura = extraerEstructuraHtml(html);
  const asuntoNorm = normalizarAsunto(subject);

  const fingerprint = [
    asuntoNorm,
    estructura.tableCount,
    estructura.trCount,
    estructura.hasMonto,
    estructura.hasFecha,
    estructura.hasComercio,
    estructura.hasTarjeta,
  ].join('|');

  return crypto.createHash('md5').update(fingerprint).digest('hex');
}

export { generarFingerprint, normalizarAsunto, extraerEstructuraHtml };
```

### 2.3 Integración en el flujo de parsing

```
1. Recibir email
2. Generar fingerprint
3. Buscar plantilla existente con mismo fingerprint
4. Si existe → usar parser asociado a esa plantilla
5. Si no existe → usar parser genérico
6. Si genérico falla → llamar Gemini
7. Guardar resultado como nueva plantilla (con ejemplo)
```

---

## FASE 3: Parsers Especializados (Semana 3-4)

### 3.1 Estructura de directorios

```
server/parsers/
  index.js              -- router principal
  base.js               -- Parser base con métodos comunes
  santander/
    index.js
    compra.js
    transferencia.js
    pago.js
  bci/
    index.js
    debito.js
    credito.js
    transferencia.js
  bancochile/
    index.js
    compra.js
    transferencia.js
  bancoestado/
    index.js
    debito.js
  mach/
    index.js
    compra.js
```

### 3.2 Parser Base

```javascript
// server/parsers/base.js
export class BaseParser {
  constructor(nombre) {
    this.nombre = nombre;
  }

  puedeParsear(html, headers) {
    throw new Error('Método no implementado');
  }

  async extraer(html, headers) {
    throw new Error('Método no implementado');
  }

  normalizarFecha(raw) {
    const match = raw.match(/(\d{2})[\/-](\d{2})[\/-](\d{4})/);
    if (match) return `${match[3]}-${match[2]}-${match[1]}`;
    return null;
  }

  normalizarMonto(raw) {
    if (!raw) return null;
    let cleaned = raw.replace(/[^0-9.,\-]/g, '');
    // ... lógica de parseo de montos
    return parseFloat(cleaned);
  }
}
```

### 3.3 Ejemplo: Parser BCI Débito

```javascript
// server/parsers/bci/debito.js
import { BaseParser } from '../base.js';

export class BCIDebitoParser extends BaseParser {
  constructor() {
    super('BCI.debito');
  }

  puedeParsear(html, headers) {
    const from = headers.from || '';
    return from.includes('bci.cl') &&
           /d[eé]bito/.test(html);
  }

  async extraer(html, headers) {
    const $ = cheerio.load(html);
    const rows = $('table tr').toArray();

    return {
      banco: 'BCI',
      tipo_movimiento: 'Compra',
      tipo_tarjeta: 'Débito',
      monto: this.extraerMonto(rows, $),
      fecha: this.extraerFecha(rows, $),
      comercio: this.extraerComercio(rows, $),
    };
  }

  extraerMonto(rows, $) {
    for (const row of rows) {
      const cells = $(row).children('td');
      if (cells.first().text().toLowerCase().includes('monto')) {
        return this.normalizarMonto(cells.eq(1).text());
      }
    }
    return null;
  }
}
```

---

## FASE 4: Embeddings para Comercios (Semana 5)

### 4.1 Extensión del schema

```sql
-- Habilitar pgvector en Supabase
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE clasificacion_comercios ADD COLUMN embedding vector(768);
CREATE INDEX idx_clasificacion_embedding ON clasificacion_comercios USING ivfflat(embedding vector_cosine_ops);
```

### 4.2 Función de embeddings locally

**Archivo**: `server/embeddings.js` (nuevo)

```javascript
// Usando modelo local ligero para embeddings
// Opciones: sentence-transformers o API de embeddings

const EMBEDDING_DIM = 768;

async function generarEmbedding(texto) {
  // Opción 1: Usar API de embeddings (OpenAI, Gemini, etc.)
  // const response = await fetch('https://api.gemini.com/embed', {...});

  // Opción 2: Usar modelo local con transformers.js
  // const model = await loadModel();
  // const embedding = await model.embed(texto);

  // Por ahora: placeholder hash-based hasta tener embedding real
  return generarPseudoEmbedding(texto);
}

function generarPseudoEmbedding(texto) {
  // Pseudo-embedding basado en hash para similarity básica
  // REEMPLAZAR con embedding real cuando se implemente
  const arr = new Array(EMBEDDING_DIM).fill(0);
  for (let i = 0; i < texto.length; i++) {
    arr[i % EMBEDDING_DIM] += texto.charCodeAt(i);
  }
  const norm = Math.sqrt(arr.reduce((sum, val) => sum + val * val, 0));
  return arr.map(val => val / norm);
}

async function encontrarComercioSimilar(comercioBuscado, userId) {
  const embedding = await generarEmbedding(comercioBuscado);

  // Buscar en DB con similitud coseno
  const resultado = await db.get(`
    SELECT comercio, categoria,
           1 - (embedding <=> $1::vector) as similitud
    FROM clasificacion_comercios
    WHERE user_id = $2
    AND 1 - (embedding <=> $1::vector) > 0.85
    ORDER BY embedding <=> $1::vector
    LIMIT 1
  `, JSON.stringify(embedding), userId);

  return resultado;
}

export { generarEmbedding, encontrarComercioSimilar };
```

### 4.3 Integración en categorización

En `transactionParser.js`, después de obtener `comercio`:

```javascript
// Buscar si existe comercio similar
const comercioExistente = await encontrarComercioSimilar(comercio, userId);
if (comercioExistente) {
  comercio = comercioExistente.comercio;
  categoria = comercioExistente.categoria;
}
```

---

## FASE 5: Repositorio de Ejemplos y Aprendizaje (Semana 6)

### 5.1 Guardar ejemplos de parsing

En `app.js`, webhook `/api/webhook/email`:

```javascript
// Después de parsing exitoso
await db.run(`
  INSERT INTO parsing_logs
    (user_id, email_id, banco_detectado, fingerprint_hash,
     parsing_exitoso, campos_extraidos, confianza_score,
     metodo_extraccion, gemini_fallback)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
`, userId, emailId, parsed.banco, fingerprint,
  parsed.monto && parsed.fecha,
  JSON.stringify({ monto: !!parsed.monto, fecha: !!parsed.fecha, comercio: !!parsed.comercio }),
  confianza, metodo, geminiFallback);

// Si es template nuevo, guardar
if (nuevoFingerprint) {
  await db.run(`
    INSERT INTO plantillas_email
      (banco, tipo_correo, fingerprint_hash, asunto_normalizado, parser_nombre, ejemplo_html)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT DO NOTHING
  `, parsed.banco, tipoCorreo, fingerprint, asuntoNormalizado, parserNombre, html.substring(0, 5000));
}
```

### 5.2 Registro de correcciones de usuario

Cuando usuario corrige categoría en `/api/transacciones/:id`:

```javascript
// Ya existe lógica similar en app.js línea 636-643
// Agregar: guardar que el usuario corrigió esta plantilla
await db.run(`
  UPDATE parsing_logs
  SET usuario_corrijo = TRUE, correccion_categoria = $1
  WHERE email_id = $2 AND user_id = $3
`, categoria, tx.email_id, userId);

// Si hay muchas correcciones para una plantilla, marcarla como fallida
await db.run(`
  UPDATE plantillas_email
  SET count_fallido = count_fallido + 1
  WHERE fingerprint_hash = $1
`, fingerprint);
```

### 5.3 Actualización de embeddings con correcciones

```javascript
async function actualizarEmbedding(userId, comercio, categoria) {
  const embedding = await generarEmbedding(comercio);

  await db.run(`
    INSERT INTO clasificacion_comercios (user_id, comercio, categoria, embedding)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT(user_id, comercio) DO UPDATE SET
      embedding = EXCLUDED.embedding,
      updated_at = NOW()
  `, userId, comercio.toLowerCase(), categoria, JSON.stringify(embedding));
}
```

---

## FASE 6: Optimización de OpenRouter (Semana 7)

### 6.1 Contexto del sistema actual

El sistema ya usa OpenRouter en `openrouterParser.js` con el modelo `openai/gpt-oss-120b:free`. El prompt actual está en líneas 37-57.

### 6.2 Bug fix crítico

**Problema**: En `openrouterParser.js:118-121`, la variable `jsonMatch` se usa sin estar definida en ese scope.

```javascript
// LÍNEA ACTUAL (BUG)
if (!jsonMatch) {
  console.warn(`[OpenRouter] No se encontro JSON en respuesta. Content: ${content.substring(0, 200)}`);
  return null;
}

// CÓDIGO CORRECTO
if (!jsonStr) {
  console.warn(`[OpenRouter] No se encontro JSON en respuesta. Content: ${content.substring(0, 200)}`);
  return null;
}
```

### 6.3 Prompt mejorado

```javascript
const PROMPT_TEMPLATE = `Eres un extractor de transacciones bancarias chilenas.

Extrae información del siguiente correo y responde SOLO con JSON válido.

Campos requeridos:
- tipo: "ingreso" | "gasto" | "interno"
- monto: número (sin puntos, sin moneda)
- moneda: "CLP" | "USD"
- fecha: "YYYY-MM-DD"
- comercio: nombre real del establecimiento (NO "Cliente", "Señor", etc.)
- categoria: una de: Mercadería | Transporte | Compras | Salud y deportes | Educación | Suscripciones | Viajes y vacaciones | Donaciones y regalos | Casa y cuentas | Sueldo | Otros ingresos | Otros | Inversiones/Renta

Reglas críticas:
- NUNCA inventes datos. Si no hay monto, returns null.
- comercio debe ser el nombre REAL del lugar (ej: "STARBUCKS", no "Café")
- Si es transferencia, el comercio es el nombre de la persona/banco
- La fecha debe ser formato ISO (YYYY-MM-DD)

Email:
${emailText.substring(0, 5000)}

Responde SOLO con JSON, sin explicaciones ni markdown.`;
```

### 6.4 Cache mejorado

```javascript
// En openrouterParser.js, já existente con cache
// Mejorar: guardar también el fingerprint del email
function cacheKey(text, subject, from, fingerprint) {
  // Incluir fingerprint para cache más específico
  return `${fingerprint || ''}|${subject || ''}|${from || ''}`.substring(0, 300);
}
```

---

## Archivos a Crear/Modificar

### Nuevos archivos
- `server/fingerprint.js` - Funciones de fingerprinting
- `server/embeddings.js` - Generación de embeddings
- `server/parsers/base.js` - Clase base para parsers
- `server/parsers/index.js` - Router de parsers
- `server/parsers/bci/index.js`, `bci/debito.js`, `bci/credito.js`, `bci/transferencia.js`
- `server/parsers/santander/index.js`, `santander/compra.js`, `santander/transferencia.js`, `santander/pago.js`
- `server/parsers/bancochile/index.js`, `bancochile/compra.js`, `bancochile/transferencia.js`
- `server/parsers/bancoestado/index.js`, `bancoestado/debito.js`
- `server/parsers/mach/index.js`, `mach/compra.js`

### Archivos a modificar
- `server/openrouterParser.js` - Bug fix línea 118-121 + prompt mejorado + cache con fingerprint
- `server/transactionParser.js` - Integrar fingerprinting, confianza, parsers especializados
- `server/app.js` - Registrar parsing logs y actualizaciones de plantillas
- `server/db.js` - Agregar función de migración para nuevas tablas
- `supabase-schema.sql` - Agregar tablas: `parsing_logs`, `plantillas_email`, `clasificacion_comercios.embedding`

---

## Migración de Datos

### Step 1: Crear tablas
```sql
-- Ejecutar en Supabase SQL Editor
-- (ver código en secciones anteriores)
```

### Step 2: Migrar transacciones existentes
```javascript
// Script para generar fingerprint de transacciones existentes
// y guardarlas en parsing_logs
```

---

## Testing

### Tests unitarios
- `test/fingerprint.test.js` - Verificar hashing consistente
- `test/parsers/bci.test.js` - Parser BCI con emails reales
- `test/confianza.test.js` - Cálculo de scores

### Tests de integración
- Procesar 50 emails conocidos y verificar accuracy
- Comparar resultados antes/después de cambios

---

## Métricas de Éxito

| Métrica | Actual | Meta |
|---------|--------|------|
| Accuracy de parsing | ~70-80% | >95% |
| Transactions auto-revisadas | ? | >80% |
| Comercios categorizados correctamente | ? | >90% |
| Fallos de parsing (usuario reporta) | ? | <5% |

---

## Orden de Implementación Sugerido

1. **Hotfix** (Día 1): Bug fix OpenRouter `jsonMatch` undefined - Quick fix crítico
2. **FASE 1** (Semana 1): Sistema de confianza - Quick win, visible rápidamente
3. **FASE 2** (Semana 2): Fingerprinting - Resuelve el problema de bancos que cambian formatos
4. **FASE 3** (Semana 3-4): Parsers especializados - Mayor accuracy por banco
5. **FASE 4** (Semana 5): Embeddings - Mejora categorización de comercios
6. **FASE 5** (Semana 6): Repositorio y aprendizaje - Ciclo virtuoso
7. **FASE 6** (Semana 7): Optimización OpenRouter - Reducir costos y mejorar calidad

---

## Notas

- **Supabase con pgbouncer**: El sistema actual usa `DATABASE_URL` con `?pgbouncer=true` (línea 19-20 de `db.js`). Transaction mode (puerto 6543). Para pgvector hay que usar conexión directa o pooler session mode.
- **OpenRouter**: Usa `gpt-oss-120b:free` - modelo gratuito. Considerar modelos más pequeños si hay problemas de rate limit.
- **pgvector**: Requiere Supabase Pro o conexión directa al pooler de postgres (puerto 5432). Alternativa: embeddings locales con `transformers.js`.
- **Parsers especializados**: Construir con ejemplos reales de cada banco (usar datos de `transacciones_extraidas.json`).
- **Cleanup**: El sistema de fingerprints puede crecer mucho; considerar cleanup periódico de plantillas no usadas (>30 días sin uso).
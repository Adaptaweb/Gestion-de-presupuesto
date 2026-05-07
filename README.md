# Gestión de Presupuesto

Aplicación web para la gestión de finanzas personales con seguimiento de deudas, gastos fijos, suscripciones y cuentas de ahorro.

## Características

- **Dashboard** — Resumen visual del estado financiero con indicadores clave
- **Gestión de Deudas** — Registro de deudas con cuotas, seguimiento mes a mes con progreso de pago
- **Gastos Fijos** — Control de gastos recurrentes (luz, agua, internet, etc.)
- **Suscripciones** — Administración de servicios por suscripción con ciclo mensual/anual
- **Cuentas de Ahorro** — Múltiples cuentas con control de depósitos y retiros por mes, saldo acumulado y sugerencias vía IA
- **Bancos Chilenos** — Integración con logos y tipos de tarjeta (Visa/Mastercard)
- **Tema personalizable** — 8 combinaciones de color y modo oscuro
- **Autenticación** — Registro e inicio de sesión de usuarios
- **Persistencia** — Datos guardados en la nube

## Tecnologías

- [React](https://react.dev/) 18
- [Vite](https://vitejs.dev/) 5
- [Tailwind CSS](https://tailwindcss.com/) 3
- [lucide-react](https://lucide.dev/) — Iconos
- [Google Gemini API](https://ai.google.dev/) — Estrategia de ahorro con IA

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

```bash
npm install
```

## Configuración

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_KEY=tu_api_key_de_gemini
```

> **Nota:** La aplicación incluye una API key de desarrollo en el código. Para producción, reemplázala con tu propia clave en una variable de entorno.

## Uso

```bash
npm run dev
```

Abrir [http://localhost:5173](http://localhost:5173) en el navegador.

### Build para producción

```bash
npm run build
npm run preview
```

## Estructura del proyecto

```
src/
├── App.jsx          # Componente principal con toda la lógica de negocio
├── Login.jsx        # Pantalla de inicio de sesión
├── Register.jsx     # Pantalla de registro
├── AdminPanel.jsx   # Panel de administración
├── index.css        # Estilos globales y personalización Tailwind
└── main.jsx         # Punto de entrada
```

## Funcionalidades principales

### Tabla unificada de gastos
Visualización mensual de todos los ítems (deudas, gastos fijos, suscripciones) con capacidad de marcar pagos y editar montos directamente en la tabla.

### Progreso de cuotas
Las deudas muestran una barra de progreso con cuotas pagadas vs. totales, tanto en el dashboard como en la columna lateral de la tabla.

### Ahorro inteligente
El botón "Estrategia IA" usa Gemini API para sugerir una distribución del excedente mensual entre diferentes objetivos de ahorro.

### Temas de color
Selección entre 8 paletas de color (índigo, azul, esmeralda, púrpura, rosa, ámbar, teal, slate) con modo oscuro automático.

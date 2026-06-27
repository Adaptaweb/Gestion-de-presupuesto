# [Arquitectura Inteligente para la Clasificación de Correos Bancarios]()  
## [Objetivo]()  
Diseñar un sistema robusto capaz de interpretar correos electrónicos provenientes de múltiples bancos y entidades financieras, independientemente de su formato, para extraer automáticamente la información relevante de las transacciones y categorizarlas correctamente.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0V2wOEMD+7krTzMFrWdt4TI5eK+CHw6TvfcKAACmsW9rLBERrbX8OwYAgDHvfVY+1+GJAwCYTFbZcAAAs/kAKegOx7/jq28AAAAASUVORK5CYII=)  
# [Problema]()  
Cada banco utiliza distintos formatos para enviar notificaciones de:  
- Transferencias recibidas  
- Transferencias enviadas  
- Compras con débito  
- Compras con crédito  
- Pagos  
- Depósitos  
- Abonos  
- Cargos automáticos  
- Inversiones  
Incluso un mismo banco puede modificar el formato de sus correos con el tiempo, lo que hace que depender únicamente de expresiones regulares (Regex) sea una solución difícil de mantener.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0T244gwN7OfY7jRT0HrWFszk4L0KfjhMq6oAAGAuPTOtOACAiWzrEj0iYozR/o4BAOCb5zqq3efuiQMAmMwLcaEOzTstkvgAAAAASUVORK5CYII=)  
# [Solución Propuesta]()  
Se propone una arquitectura híbrida basada en reglas, parsers especializados e Inteligencia Artificial.  
Correo recibido  
         │  
         ▼  
 Normalización HTML  
         │  
         ▼  
 Extracción de texto limpio  
         │  
         ▼  
 Detección del banco  
         │  
         ▼  
 Clasificador de plantilla  
         │  
         ▼  
 Parser especializado  
         │  
         ▼  
 (En caso de falla)  
         │  
         ▼  
 Extractor IA  
         │  
         ▼  
 Normalización  
         │  
         ▼  
 Clasificación  
         │  
         ▼  
 Motor de categorías  
         │  
         ▼  
 Resultado Final  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0V2wOEMD+7krTzMFrWdt4TI5eK+CHw6TvfcKAACmsW9rLBERrbX8OwYAgDHvfVY+1+GJAwCYTFbZcAAAs/kAKegOx7/jq28AAAAASUVORK5CYII=)  
# [1. Normalización del correo]()  
Los correos llegan en formato HTML.  
Antes de procesarlos es necesario:  
- eliminar estilos  
- eliminar imágenes  
- eliminar firmas  
- eliminar publicidad  
- convertir el HTML a texto estructurado  
Ejemplo:  
Antes:  
<**td**>< **b**>Has recibido una transferencia por $50.000</ **b**></ **td**>  
Después:  
Has recibido una transferencia por $50.000  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0T244gwN7OfY7jRT0HrWFszk4L0KfjhMq6oAAGAuPTOtOACAiWzrEj0iYozR/o4BAOCb5zqq3efuiQMAmMwLcaEOzTstkvgAAAAASUVORK5CYII=)  
# [2. Identificación del Banco]()  
Antes de interpretar el contenido, identificar quién envía el correo.  
Fuentes posibles:  
- From  
- Return-Path  
- DKIM  
- SPF  
- Dominio  
Ejemplo:  
notificaciones@santander.cl  
   
 ↓  
   
 Banco = Santander  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0V2wOEMD+7krTzMFrWdt4TI5eK+CHw6TvfcKAACmsW9rLBERrbX8OwYAgDHvfVY+1+GJAwCYTFbZcAAAs/kAKegOx7/jq28AAAAASUVORK5CYII=)  
# [3. Clasificación del tipo de correo]()  
Cada banco posee distintos tipos de notificaciones.  
Ejemplo:  
Transferencia recibida  
   
 Transferencia enviada  
   
 Compra débito  
   
 Compra crédito  
   
 Pago automático  
   
 Depósito  
   
 Cargo  
   
 Abono  
La clasificación permite utilizar un parser específico.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0T244gwN7OfY7jRT0HrWFszk4L0KfjhMq6oAAGAuPTOtOACAiWzrEj0iYozR/o4BAOCb5zqq3efuiQMAmMwLcaEOzTstkvgAAAAASUVORK5CYII=)  
# [4. Parsers especializados]()  
En lugar de tener un único parser enorme, cada banco tendrá sus propios extractores.  
Ejemplo:  
ParserSantander  
   
 ParserBCI  
   
 ParserBancoEstado  
   
 ParserBancoChile  
   
 ParserScotiabank  
   
 ParserMach  
   
 ParserTenpo  
Y dentro de cada banco:  
ParserCompraDebito  
   
 ParserCompraCredito  
   
 ParserTransferencia  
   
 ParserDeposito  
   
 ParserPago  
Esto facilita el mantenimiento cuando un banco cambia sus formatos.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0V2wOEMD+7krTzMFrWdt4TI5eK+CHw6TvfcKAACmsW9rLBERrbX8OwYAgDHvfVY+1+GJAwCYTFbZcAAAs/kAKegOx7/jq28AAAAASUVORK5CYII=)  
# [5. Extracción por entidades]()  
En vez de depender únicamente de Regex, el sistema buscará entidades específicas.  
## [Monto]()  
Ejemplos  
$50.000  
   
 CLP 50.000  
   
 USD 120  
   
 $12,450  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0T244gwN7OfY7jRT0HrWFszk4L0KfjhMq6oAAGAuPTOtOACAiWzrEj0iYozR/o4BAOCb5zqq3efuiQMAmMwLcaEOzTstkvgAAAAASUVORK5CYII=)  
## [Fecha]()  
24/05/2026  
   
 24 Mayo 2026  
   
 2026-05-24  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0T244gwN7OfY7jRT0HrWFszk4L0KfjhMq6oAAGAuPTOtOACAiWzrEj0iYozR/o4BAOCb5zqq3efuiQMAmMwLcaEOzTstkvgAAAAASUVORK5CYII=)  
## [Comercio]()  
STARBUCKS  
   
 UBER  
   
 COPEC  
   
 MERCADOLIBRE  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0V2wOEMD+7krTzMFrWdt4TI5eK+CHw6TvfcKAACmsW9rLBERrbX8OwYAgDHvfVY+1+GJAwCYTFbZcAAAs/kAKegOx7/jq28AAAAASUVORK5CYII=)  
## [Cuenta]()  
****1234  
   
 Cuenta Vista 5678  
   
 CC 12345678  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0V2wOEMD+7krTzMFrWdt4TI5eK+CHw6TvfcKAACmsW9rLBERrbX8OwYAgDHvfVY+1+GJAwCYTFbZcAAAs/kAKegOx7/jq28AAAAASUVORK5CYII=)  
# [6. Uso de Inteligencia Artificial]()  
Cuando ningún parser pueda interpretar correctamente un correo, se utilizará un modelo LLM.  
El modelo recibirá el texto del correo y responderá únicamente un JSON estructurado.  
Ejemplo de Prompt:  
Eres un extractor de transacciones bancarias.  
   
 Devuelve únicamente JSON.  
   
 Campos:  
   
 tipo  
 monto  
 moneda  
 fecha  
 hora  
 descripcion  
 comercio  
 cuenta  
 origen  
 destino  
Respuesta esperada:  
{  
     "tipo":"Transferencia",  
     "monto":50000,  
     "moneda":"CLP",  
     "fecha":"2026-05-24",  
     "descripcion":"Transferencia recibida",  
     "cuenta":"****1234",  
     "origen":"Juan Pérez"  
 }  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0V2wOEMD+7krTzMFrWdt4TI5eK+CHw6TvfcKAACmsW9rLBERrbX8OwYAgDHvfVY+1+GJAwCYTFbZcAAAs/kAKegOx7/jq28AAAAASUVORK5CYII=)  
# [7. Normalización]()  
Independientemente del banco, toda transacción terminará con el mismo formato.  
{  
     "banco":"Santander",  
     "tipo":"Compra",  
     "monto":15000,  
     "fecha":"2026-05-20",  
     "descripcion":"Starbucks",  
     "cuenta":"****1234"  
 }  
Esto simplifica completamente el resto del sistema.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0V2wOEMD+7krTzMFrWdt4TI5eK+CHw6TvfcKAACmsW9rLBERrbX8OwYAgDHvfVY+1+GJAwCYTFbZcAAAs/kAKegOx7/jq28AAAAASUVORK5CYII=)  
# [8. Motor de categorización]()  
Una vez normalizada la transacción, se asignará una categoría.  
Ejemplos:  
Starbucks  
 ↓  
   
 Café  
Uber  
 ↓  
   
 Transporte  
Copec  
 ↓  
   
 Combustible  
Mercado Libre  
 ↓  
   
 Compras  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0T244gwN7OfY7jRT0HrWFszk4L0KfjhMq6oAAGAuPTOtOACAiWzrEj0iYozR/o4BAOCb5zqq3efuiQMAmMwLcaEOzTstkvgAAAAASUVORK5CYII=)  
# [9. Motor de reglas]()  
La mayoría de los casos pueden resolverse sin IA.  
Ejemplo:  
**if** comercio == "UBER":  
     categoria = "Transporte"  
   
 **if** comercio == "COPEC":  
     categoria = "Combustible"  
   
 **if** comercio == "STARBUCKS":  
     categoria = "Café"  
   
 **if** comercio == "JUMBO":  
     categoria = "Supermercado"  
Las reglas son rápidas y prácticamente gratuitas.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0V2wOEMD+7krTzMFrWdt4TI5eK+CHw6TvfcKAACmsW9rLBERrbX8OwYAgDHvfVY+1+GJAwCYTFbZcAAAs/kAKegOx7/jq28AAAAASUVORK5CYII=)  
# [10. Uso inteligente de IA]()  
No todos los correos requieren IA.  
Flujo recomendado:  
Correo  
   
 ↓  
   
 Parser  
   
 ↓  
   
 ¿Éxito?  
   
 Sí  
 ↓  
   
 Guardar  
   
 No  
 ↓  
   
 IA  
   
 ↓  
   
 Guardar nueva plantilla  
Esto reduce significativamente los costos.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0V2wOEMD+7krTzMFrWdt4TI5eK+CHw6TvfcKAACmsW9rLBERrbX8OwYAgDHvfVY+1+GJAwCYTFbZcAAAs/kAKegOx7/jq28AAAAASUVORK5CYII=)  
# [11. Repositorio de plantillas]()  
Guardar ejemplos reales de cada correo recibido.  
Ejemplo:  
/plantillas  
   
     Santander/  
   
         compra001.html  
   
         compra002.html  
   
         transferencia001.html  
   
     BancoChile/  
   
     BCI/  
   
     BancoEstado/  
Cada vez que un usuario reporte un error, se agrega un nuevo ejemplo.  
El sistema mejora constantemente.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0V2wOEMD+7krTzMFrWdt4TI5eK+CHw6TvfcKAACmsW9rLBERrbX8OwYAgDHvfVY+1+GJAwCYTFbZcAAAs/kAKegOx7/jq28AAAAASUVORK5CYII=)  
# [12. Sistema de confianza]()  
Cada extracción devuelve un porcentaje de confianza.  
Ejemplo:  
98%  
   
 ↓  
   
 Guardar automáticamente  
82%  
   
 ↓  
   
 Mostrar sugerencia  
45%  
   
 ↓  
   
 Solicitar revisión al usuario  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0V2wOEMD+7krTzMFrWdt4TI5eK+CHw6TvfcKAACmsW9rLBERrbX8OwYAgDHvfVY+1+GJAwCYTFbZcAAAs/kAKegOx7/jq28AAAAASUVORK5CYII=)  
# [13. Aprendizaje continuo]()  
Si el usuario corrige una categoría:  
SUSHI KING  
   
 ↓  
   
 Restaurante  
El sistema recordará la próxima vez.  
Ejemplo:  
Comercio:  
   
 SUSHI KING  
   
 ↓  
   
 Categoría:  
   
 Restaurante  
Con el tiempo el porcentaje de aciertos aumenta considerablemente.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0V2wOEMD+7krTzMFrWdt4TI5eK+CHw6TvfcKAACmsW9rLBERrbX8OwYAgDHvfVY+1+GJAwCYTFbZcAAAs/kAKegOx7/jq28AAAAASUVORK5CYII=)  
# [14. Embeddings para reconocimiento de comercios]()  
Muchos comercios aparecen escritos de distintas formas.  
Ejemplo:  
STARBUCKS  
   
 STARBUCKS CHILE  
   
 STARBUCKS MALL  
   
 SBX CHILE  
   
 STARBUCKS COFFEE  
Todos representan el mismo comercio.  
Utilizando embeddings y búsqueda vectorial es posible agrupar automáticamente estos nombres bajo una única entidad.  
Tecnologías recomendadas:  
- pgvector  
- Qdrant  
- Pinecone  
- Weaviate  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0V2wOEMD+7krTzMFrWdt4TI5eK+CHw6TvfcKAACmsW9rLBERrbX8OwYAgDHvfVY+1+GJAwCYTFbZcAAAs/kAKegOx7/jq28AAAAASUVORK5CYII=)  
# [15. Plantillas Inteligentes (Fingerprint)]()  
Una mejora muy potente consiste en identificar plantillas mediante una huella estructural.  
En lugar de comparar únicamente el texto completo, se calcula un fingerprint considerando:  
- asunto normalizado  
- estructura HTML  
- orden de tablas  
- bloques de texto  
- frases características  
- longitud aproximada  
- cantidad de tablas  
- etiquetas HTML utilizadas  
Ejemplo:  
Asunto:  
   
 Has recibido una transferencia de $50.000  
   
 ↓  
   
 Normalizado:  
   
 Has recibido una transferencia de <MONTO>  
Si la similitud es alta, el sistema reutiliza automáticamente el parser correspondiente.  
Si no existe una coincidencia:  
↓  
   
 IA  
   
 ↓  
   
 Nueva plantilla  
   
 ↓  
   
 Guardar fingerprint  
Con el tiempo el sistema prácticamente deja de depender de IA.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0T244gwN7OfY7jRT0HrWFszk4L0KfjhMq6oAAGAuPTOtOACAiWzrEj0iYozR/o4BAOCb5zqq3efuiQMAmMwLcaEOzTstkvgAAAAASUVORK5CYII=)  
# [Pipeline Completo]()  
Correo recibido  
       │  
       ▼  
 Extraer HTML  
       │  
       ▼  
 Limpiar contenido  
       │  
       ▼  
 Detectar Banco  
       │  
       ▼  
 Buscar plantilla conocida  
       │  
       ├──────────────┐  
       │              │  
       ▼              ▼  
 Existe         No existe  
       │              │  
       ▼              ▼  
 Parser      IA (LLM)  
       │              │  
       └──────┬───────┘  
              ▼  
 Normalizar JSON  
              ▼  
 Motor de reglas  
              ▼  
 Embeddings  
              ▼  
 Categoría  
              ▼  
 Score de confianza  
              ▼  
 Guardar  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0T244gwN7OfY7jRT0HrWFszk4L0KfjhMq6oAAGAuPTOtOACAiWzrEj0iYozR/o4BAOCb5zqq3efuiQMAmMwLcaEOzTstkvgAAAAASUVORK5CYII=)  
# [Tecnologías Recomendadas]()  
## [Backend]()  
- Python  
- FastAPI  
- Celery  
- RabbitMQ  
## [Base de datos]()  
- PostgreSQL  
- MongoDB  
## [Búsqueda vectorial]()  
- pgvector  
- Qdrant  
## [Inteligencia Artificial]()  
Modelos locales:  
- Qwen 3  
- Gemma  
- Llama 3.x  
- Phi  
Modelos en la nube:  
- GPT-5  
- GPT-4.1  
- Claude  
- Gemini  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0V2wOEMD+7krTzMFrWdt4TI5eK+CHw6TvfcKAACmsW9rLBERrbX8OwYAgDHvfVY+1+GJAwCYTFbZcAAAs/kAKegOx7/jq28AAAAASUVORK5CYII=)  
# [Ventajas de esta arquitectura]()  
- Escalable.  
- Fácil de mantener.  
- Independiente del formato del correo.  
- Aprende automáticamente con el tiempo.  
- Minimiza el uso de IA.  
- Reduce costos de procesamiento.  
- Alta precisión (>95%) después de incorporar suficientes ejemplos reales.  
- Permite agregar nuevos bancos sin modificar el resto del sistema.  
- Compatible con múltiples idiomas y monedas.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0T244gwN7OfY7jRT0HrWFszk4L0KfjhMq6oAAGAuPTOtOACAiWzrEj0iYozR/o4BAOCb5zqq3efuiQMAmMwLcaEOzTstkvgAAAAASUVORK5CYII=)  
# [Evolución futura]()  
A medida que aumente la cantidad de ejemplos, el sistema podrá:  
- Detectar nuevas plantillas automáticamente.  
- Clasificar comercios desconocidos mediante similitud semántica.  
- Sugerir nuevas reglas.  
- Detectar fraudes o correos sospechosos.  
- Aprender preferencias de categorización específicas de cada usuario.  
- Generar estadísticas de precisión por banco y tipo de correo.  
- Autoactualizar sus parsers a partir de correcciones validadas.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAAECAYAAADh/WljAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAATUlEQVR4nO3YsQmAQBBE0T244gwN7OfY7jRT0HrWFszk4L0KfjhMq6oAAGAuPTOtOACAiWzrEj0iYozR/o4BAOCb5zqq3efuiQMAmMwLcaEOzTstkvgAAAAASUVORK5CYII=)  
# [Conclusión]()  
La estrategia recomendada no consiste en depender exclusivamente de expresiones regulares ni únicamente de Inteligencia Artificial, sino en combinar ambas aproximaciones. Los parsers y reglas ofrecen rapidez y bajo costo para los formatos conocidos, mientras que la IA actúa como respaldo para plantillas nuevas o modificadas. Con un repositorio de ejemplos, un sistema de fingerprint, embeddings para comercios y aprendizaje continuo basado en las correcciones de los usuarios, la plataforma se vuelve cada vez más precisa y requiere menos intervención manual con el tiempo.  

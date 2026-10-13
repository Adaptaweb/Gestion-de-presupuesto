# Cobro con Mercado Pago

La app cobra con suscripciones de Mercado Pago (`/preapproval`). Sin
credenciales todo funciona salvo crear el cobro: `POST /api/billing/checkout`
responde 503 y el modal "Mi plan" muestra "Los pagos se habilitarán muy pronto".

## Cómo funciona

1. La prueba de 60 días parte al terminar el tutorial del correo
   (`users.trial_started_at`).
2. Desde el día 53 hay aviso en la app y correo. El usuario elige plan en
   "Mi plan" y paga en el checkout alojado de Mercado Pago.
3. Mercado Pago avisa al webhook `/api/billing/webhook`. El servidor vuelve a
   consultar la suscripción con su propio token: el cuerpo del webhook nunca se
   toma como verdad.
4. Sin plan ni prueba vigente la cuenta queda en solo lectura 30 días (el
   servidor responde 402 a las escrituras) y después se suspende. No se borra
   nada.
5. Un cron diario (`/api/cron/billing`, 13:00 UTC) envía los avisos de prueba y
   de solo lectura. Cada aviso se envía una sola vez (tabla `billing_avisos`).

## Variables de entorno (Vercel)

| Variable | Qué es |
|---|---|
| `MP_ACCESS_TOKEN` | Access Token de producción (o de prueba) de tu aplicación |
| `MP_WEBHOOK_SECRET` | Clave secreta del webhook (firma `x-signature`) |
| `APP_URL` | `https://gastos.adaptaweb.cl` (vuelta del checkout y enlaces de correos) |
| `CRON_SECRET` | `openssl rand -hex 32`; Vercel la manda al cron como `Bearer` |
| `RESEND_API_KEY` | Ya existe: envía los correos |

## Crear la cuenta de vendedor

1. Entra a mercadopago.cl con una cuenta (o crea una) y completa la validación
   de identidad (RUT, documento) y la cuenta bancaria para retiros.
2. Abre **Mercado Pago Developers** (mercadopago.cl/developers) → **Tus
   integraciones** → **Crear aplicación**. Nombre: Kuentas Klaras. Producto:
   suscripciones / pagos online.
3. En la aplicación, **Credenciales de prueba**: copia el Access Token y
   pruébalo primero. Crea usuarios de prueba (vendedor y comprador).
4. **Webhooks** → URL `https://gastos.adaptaweb.cl/api/billing/webhook`, evento
   **Planes y suscripciones** (`subscription_preapproval` y
   `subscription_authorized_payment`). Copia la **clave secreta**.
5. Carga las variables en Vercel y vuelve a desplegar.
6. Prueba con las tarjetas de prueba de Mercado Pago: suscribirse, ver el plan
   activo, cancelar, y revisar que lleguen los correos.
7. Para producción activa las **Credenciales de producción** (pide datos del
   negocio y el sitio), cambia `MP_ACCESS_TOKEN` y repite el webhook.

## Pendiente fuera del código

- **Boletas del SII:** cobrar un servicio de forma habitual exige iniciar
  actividades y emitir boleta o factura electrónica. Consúltalo con un contador.
- **Revisión legal** de los Términos y Condiciones (renovación automática,
  retracto, cambio de precios).
- **Plan Pareja o familia:** aparece como "Próximamente". No se vende hasta que
  existan los hogares compartidos.

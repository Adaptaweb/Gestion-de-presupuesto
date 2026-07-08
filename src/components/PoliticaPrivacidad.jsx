import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const Section = ({ number, title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-black text-kk-dark dark:text-kk-secondary mb-4 flex items-center gap-2">
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-kk-primary/10 text-kk-primary text-sm font-black shrink-0">
        {number}
      </span>
      {title}
    </h2>
    <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-3 font-medium">
      {children}
    </div>
  </div>
);

const PoliticaPrivacidad = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-kk-background dark:bg-dark-darker font-sans transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-kk-primary hover:text-kk-dark dark:hover:text-kk-secondary font-black mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        <div className="flex items-center gap-3 mb-2">
          <img src="/kuentasklaras-logo.svg" alt="Kuentas Klaras" className="h-10 w-auto" />
          <div>
            <h1 className="text-3xl font-black text-kk-dark dark:text-white">
              Kuentas Klaras
            </h1>
          </div>
        </div>
        <p className="text-sm font-black text-kk-primary uppercase tracking-widest mb-8 mt-2">
          Política de Privacidad
        </p>

        <div className="bg-white dark:bg-dark-normal rounded-2xl shadow-kk-md p-6 sm:p-10">
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mb-8">
            Última actualización: Julio 2026
          </p>

          <Section number="1" title="Introducción">
            <p>
              En Kuentas Klaras valoramos la confianza que depositas en nosotros. Por eso, nos comprometemos a proteger y gestionar tus datos personales con total responsabilidad, cumpliendo con la legislación chilena vigente y aplicando medidas de seguridad que resguarden tu información en todo momento.
            </p>
          </Section>

          <Section number="2" title="Responsable del Tratamiento de Datos">
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="font-black">Razón Social:</span> Panarea SpA (en adelante, "Kuentas Klaras").</li>
              <li><span className="font-black">Contacto:</span> <a href="mailto:soporte@kuentasklaras.cl" className="text-kk-primary hover:underline font-black">soporte@kuentasklaras.cl</a></li>
              <li><span className="font-black">Domicilio:</span> Tomás Graham 752 D 304, Las Condes, Santiago, Chile.</li>
            </ul>
          </Section>

          <Section number="3" title="Datos Personales que Recopilamos">
            <p>Para operar nuestro servicio, recopilamos y procesamos la siguiente información:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="font-black">Datos de Identificación:</span> Nombre completo, RUT, correo electrónico personal, número de teléfono móvil y contraseña de tu cuenta en Kuentas Klaras.</li>
              <li><span className="font-black">Datos Bancarios:</span> Información de transacciones (monto, fecha, banco, medio de pago, comercio, origen o destinatario) obtenida a través de correos de respaldo, transferencias y cartolas bancarias.</li>
              <li><span className="font-black">Correos de Respaldo:</span> Configuras el reenvío automático o manual de correos con comprobantes de pago, cartolas bancarias y estados de cuenta de tarjetas de crédito a <span className="font-black">inbox@kuentasklaras.cl</span>.</li>
              <li><span className="font-black">Contraseñas de PDF:</span> Algunos bancos protegen sus archivos PDF con una clave basada en combinaciones del RUT. Kuentas Klaras utiliza esta información para extraer las transacciones, pero jamás almacenamos contraseñas bancarias.</li>
              <li><span className="font-black">Otros Datos:</span> Cualquier información adicional que decidas proporcionar al usar funciones de la app, como reglas de categorización, notas personales o descripciones de gastos.</li>
              <li><span className="font-black">Geolocalización:</span> Para asociar ubicación a tus transacciones y facilitar su identificación y clasificación.</li>
            </ul>
            <p className="mt-2">
              <span className="font-black">Importante:</span> No recopilamos contraseñas bancarias directas ni datos sensibles que permitan acceder a tus cuentas.
            </p>
          </Section>

          <Section number="4" title="Uso de los Datos">
            <p>
              El propósito principal de la recolección de datos es ordenar y clasificar tus transacciones, permitiéndote visualizar tus gastos por categorías y grupos, además de ofrecerte herramientas para automatizar y agilizar este proceso. También usamos esta información para entregarte recomendaciones y consejos para ahorrar.
            </p>
            <p>Algunos ejemplos concretos:</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li><span className="font-black">Automatización de Categorías:</span> A medida que usas Kuentas Klaras, la app aprende de tus interacciones y sugiere automáticamente categorías de gasto o etiqueta ciertos comercios.</li>
              <li><span className="font-black">Reportes y Visualizaciones:</span> Generamos resúmenes y gráficos para que revises tu historial, detectes patrones de consumo y veas tu evolución mes a mes.</li>
              <li><span className="font-black">Exportación de Datos:</span> Puedes descargar tu información en formato Excel para llevar un registro offline o realizar análisis más detallados.</li>
              <li><span className="font-black">Encuestas y Mejora del Servicio:</span> La información recopilada nos ayuda a optimizar funcionalidades y brindarte una experiencia más personalizada. Puedes optar por no participar en las encuestas cuando lo desees.</li>
              <li><span className="font-black">Soporte y Atención al Cliente:</span> Al solicitar ayuda, autorizas a nuestro equipo a contactarte y, si es necesario, revisar tu información de transacciones bajo estrictos protocolos de confidencialidad.</li>
              <li><span className="font-black">Estadísticas Agregadas:</span> Podemos difundir información de uso, gastos o ingresos de forma agregada y anonimizada, sin identificar a ningún usuario en particular.</li>
            </ol>
            <p className="mt-2">
              En ningún caso Kuentas Klaras ofrece asesoría de inversión, contable, tributaria o legal. Eres responsable de revisar y confirmar la exactitud de la clasificación y de cualquier decisión financiera que tomes a partir de los datos procesados en nuestra app.
            </p>
          </Section>

          <Section number="5" title="Compartición de Datos con Terceros">
            <ol className="list-decimal pl-6 space-y-1">
              <li><span className="font-black">No compartimos tus datos:</span> Toda la información que manejamos se utiliza exclusivamente para brindarte el servicio de organización de gastos.</li>
              <li><span className="font-black">Excepciones Legales:</span> Podríamos vernos obligados a revelar información personal si fuera requerido por ley, orden judicial o en el contexto de una investigación legal que cumpla con la normativa chilena.</li>
              <li><span className="font-black">Excepciones Técnicas:</span> Para operar, Kuentas Klaras almacena y procesa información en servidores cloud, sistemas backend, APIs de inteligencia artificial y proveedores de pago. Todos estos servicios operan en sesiones privadas a nombre de Kuentas Klaras y se comprometen contractualmente a no compartir tu información. Las empresas involucradas son:
                <ul className="list-disc pl-6 mt-1">
                  <li>Google</li>
                  <li>OpenAI</li>
                  <li>Anthropic</li>
                  <li>Xano</li>
                  <li>Amazon Web Services</li>
                  <li>Flow (pagos)</li>
                </ul>
              </li>
            </ol>
          </Section>

          <Section number="6" title="Protección de Datos">
            <p>
              Para desarrollar Kuentas Klaras de forma ágil y segura, trabajamos con Xano como nuestro proveedor de backend. Esto asegura que el resguardo de la base de datos cumple con los estándares internacionales ISO 27001, ISO 9001 e ISO 27701, entre otros.
            </p>
            <p>
              Todos los correos electrónicos con información bancaria que nos reenvíes son recibidos y almacenados por Amazon Web Services, líder en infraestructura tecnológica. Una vez extraída la información para su uso en la plataforma, los correos se eliminan en un plazo máximo de 120 días.
            </p>
            <p>Medidas de seguridad que aplicamos:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Protocolos de cifrado y enmascarado de datos.</li>
              <li>Uso de gestores de contraseñas y autenticación de doble factor.</li>
              <li>Políticas internas estrictas de control de acceso.</li>
            </ul>
            <p className="mt-2">
              <span className="font-black">Tu responsabilidad:</span> También es fundamental que protejas tu cuenta usando contraseñas seguras y evitando compartir tus credenciales con terceros.
            </p>
          </Section>

          <Section number="7" title="Acceso, Rectificación y Eliminación de Datos">
            <ol className="list-decimal pl-6 space-y-1">
              <li><span className="font-black">Acceso y Modificación:</span> Puedes revisar y actualizar tus datos personales en cualquier momento desde tu perfil en la app.</li>
              <li><span className="font-black">Borrado Total:</span> Si deseas eliminar tu información y cancelar tu cuenta, puedes hacerlo desde tu perfil o escribiendo a <a href="mailto:soporte@kuentasklaras.cl" className="text-kk-primary hover:underline font-black">soporte@kuentasklaras.cl</a>. Recuerda deshabilitar el reenvío automático de correos en tu proveedor de email.</li>
              <li><span className="font-black">Plazos de Respuesta:</span> Nos comprometemos a responder solicitudes de acceso, rectificación o eliminación en un plazo máximo de 15 días hábiles.</li>
            </ol>
          </Section>

          <Section number="8" title="Retención de Datos">
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="font-black">Período de Conservación:</span> Conservamos tu información mientras uses nuestros servicios y conforme lo requieran las leyes chilenas.</li>
              <li><span className="font-black">Eliminación Posterior:</span> Si solicitas la supresión de tus datos, los eliminaremos o anonimizaremos, salvo que existan obligaciones legales que justifiquen su conservación.</li>
            </ul>
          </Section>

          <Section number="9" title="Cumplimiento Legal">
            <p>
              Kuentas Klaras cumple con la Ley N° 21.719 de Protección de Datos Personales en Chile, alineándose además con estándares internacionales como el Reglamento General de Protección de Datos (RGPD) de la Unión Europea.
            </p>
          </Section>

          <Section number="10" title="Cambios en esta Política">
            <p>
              Podemos actualizar esta Política para reflejar cambios en la legislación o en nuestras prácticas. Cualquier modificación será notificada a través de la app o por correo electrónico, indicando la fecha de entrada en vigencia. El uso continuado de Kuentas Klaras después de la fecha efectiva implicará la aceptación de los cambios.
            </p>
          </Section>

          <Section number="11" title="Contacto">
            <p>
              Si tienes dudas, comentarios o inquietudes sobre esta Política de Privacidad, escríbenos a{' '}
              <a href="mailto:soporte@kuentasklaras.cl" className="text-kk-primary hover:underline font-black">soporte@kuentasklaras.cl</a>.
              Nuestro equipo estará disponible para ayudarte con cualquier consulta relacionada con tus datos personales.
            </p>
            <p className="mt-4">
              Gracias por confiar en Kuentas Klaras. Seguimos trabajando para que tengas el mejor control de tus finanzas con la máxima seguridad y tranquilidad.
            </p>
          </Section>

          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-3 p-4 bg-kk-light/50 dark:bg-dark-lighter rounded-xl">
              <Shield className="text-kk-primary shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Si necesitas más información sobre cómo cuidamos tus datos, escríbenos a{' '}
                <a href="mailto:soporte@kuentasklaras.cl" className="text-kk-primary hover:underline font-black">
                  soporte@kuentasklaras.cl
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-sm text-slate-400 dark:text-slate-500 hover:text-kk-primary font-medium transition-colors"
          >
            ← Volver a la aplicación
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PoliticaPrivacidad;

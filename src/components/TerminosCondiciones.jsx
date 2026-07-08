import React from 'react';
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

const TerminosCondiciones = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-kk-background dark:bg-dark-darker font-sans transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={onBack}
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
          Términos y Condiciones de Uso
        </p>

        <div className="bg-white dark:bg-dark-normal rounded-2xl shadow-kk-md p-6 sm:p-10">
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mb-8">
            Última actualización: Julio 2026
          </p>

          <Section number="1" title="Descripción del Servicio">
            <p>
              Kuentas Klaras es una aplicación diseñada para ayudarte a organizar, categorizar y controlar tus gastos personales y familiares de forma simple, rápida y eficiente. La app te permite centralizar automáticamente tus transacciones desde diferentes medios de pago y cuentas bancarias, procesando correos relacionados con pagos, transferencias y cartolas bancarias que tú mismo nos haces llegar.
            </p>
            <p>
              La aplicación te ayuda a clasificar cada movimiento como <span className="font-black">"gasto"</span>, <span className="font-black">"no gasto"</span> o <span className="font-black">"por cobrar"</span>. No solo puedes ordenar tus gastos en categorías y grupos (como personales, del hogar, suscripciones, etc.), sino que además Kuentas Klaras aprende de tus interacciones para automatizar este proceso con el tiempo. También ofrece herramientas para personalizar reglas de clasificación, exportar datos a Excel y analizar tus finanzas de manera visual con gráficos y tableros interactivos.
            </p>
            <p>
              Nuestro objetivo es que tengas un control real de tus finanzas dedicando solo unos minutos al mes. Con esta información, buscamos desarrollarte herramientas inteligentes que te entreguen hallazgos y recomendaciones concretas para ahorrar y optimizar tus recursos.
            </p>
          </Section>

          <Section number="2" title="Uso de la Aplicación">
            <h3 className="font-black text-kk-dark dark:text-white mt-5 mb-2">2.1 Requisitos de Registro</h3>
            <p>Para utilizar Kuentas Klaras, debes cumplir con los siguientes requisitos:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="font-black">Edad mínima:</span> Ser mayor de 18 años.</li>
              <li><span className="font-black">Identidad verificada:</span> Proporcionar información válida y actualizada, que incluye:
                <ul className="list-circle pl-6 mt-1 space-y-1">
                  <li>Nombre o alias.</li>
                  <li>RUT (Rol Único Tributario) válido en Chile.</li>
                  <li>Dirección de correo electrónico activa.</li>
                  <li>Número de teléfono móvil (opcional).</li>
                </ul>
              </li>
            </ul>
            <p className="mt-2">
              Al registrarte, declaras que toda la información entregada es veraz, completa y está actualizada. Cualquier falsedad podrá derivar en la suspensión inmediata de tu cuenta. En particular, declaras que la dirección de correo electrónico te pertenece.
            </p>

            <h3 className="font-black text-kk-dark dark:text-white mt-6 mb-2">2.2 Protección de Datos Personales</h3>
            <p>
              Toda la información recopilada será tratada de acuerdo con la Ley N.º 19.628 sobre Protección de la Vida Privada y la Ley N.º 21.719 que crea la Agencia de Protección de Datos Personales. Kuentas Klaras se compromete a resguardar tus datos mediante estándares de seguridad de la información. No compartiremos información personal con terceros sin tu consentimiento explícito, salvo que sea requerido por ley o por una orden judicial.
            </p>

            <h3 className="font-black text-kk-dark dark:text-white mt-6 mb-2">2.3 Información Solicitada y Permisos</h3>
            <p>Para brindar nuestros servicios, Kuentas Klaras requiere acceso o recopilación de la siguiente información:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="font-black">Correos electrónicos de notificaciones bancarias:</span> A través de una casilla de correo exclusiva hacia donde puedes enviar o reenviar respaldos de tus transacciones.</li>
              <li><span className="font-black">Cartolas de cuentas bancarias:</span> Enviadas, reenviadas o cargadas manualmente por ti en formato PDF o Excel.</li>
              <li><span className="font-black">Estado de cuenta de tarjetas de crédito:</span> Enviadas, reenviadas o cargadas manualmente en formato PDF o Excel.</li>
              <li><span className="font-black">Permisos de notificaciones:</span> Para enviarte recordatorios, alertas de gastos y notificaciones relevantes.</li>
              <li><span className="font-black">Permiso de geolocalización:</span> Para asociar ubicación a tus transacciones y ayudarte a identificarlas y clasificarlas.</li>
            </ul>
            <p className="mt-2">
              Serás informado de cada solicitud de acceso y podrás revocar estos permisos en cualquier momento, lo que podría limitar el uso de ciertas funcionalidades de la app.
            </p>

            <h3 className="font-black text-kk-dark dark:text-white mt-6 mb-2">2.4 Responsabilidades del Usuario</h3>
            <p>Como usuario te comprometes a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="font-black">Uso correcto:</span> Utilizar la aplicación únicamente para el procesamiento de gastos personales con los fines permitidos en estos Términos y Condiciones.</li>
              <li><span className="font-black">Prohibición de actividades ilícitas:</span> Queda estrictamente prohibido utilizar Kuentas Klaras para actividades como fraudes, lavado de dinero, envío de información falsa o adulterada, o cualquier actividad que viole las leyes chilenas o internacionales.</li>
              <li><span className="font-black">Resguardo de credenciales:</span> Mantener en confidencialidad tus credenciales de acceso. Kuentas Klaras no se responsabiliza por accesos no autorizados debido a negligencia en la protección de tu información.</li>
              <li><span className="font-black">Método de pago activo:</span> Mantener un método de pago vigente para el cobro de la suscripción. No nos hacemos responsables por pérdidas de información debido al cierre de cuentas causado por el cese de pago.</li>
            </ul>

            <h3 className="font-black text-kk-dark dark:text-white mt-6 mb-2">2.5 Período de Prueba y Suscripción</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Los usuarios nuevos acceden a un período de prueba gratuito de 30 días.</li>
              <li>Finalizado el período de prueba, se requiere un método de pago registrado para continuar usando Kuentas Klaras.</li>
              <li>La suscripción se renueva automáticamente de forma mensual a través de nuestro proveedor de pago, salvo que canceles el servicio antes de la fecha de facturación.</li>
            </ul>

            <h3 className="font-black text-kk-dark dark:text-white mt-6 mb-2">2.6 Restricciones de Uso</h3>
            <p>Kuentas Klaras puede suspender o cancelar cuentas de usuarios que:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Intenten manipular o alterar las funcionalidades de la aplicación.</li>
              <li>Interfieran con la operación de otros usuarios o del sistema.</li>
              <li>Realicen actividades que representen riesgos legales o financieros para la plataforma.</li>
            </ul>

            <h3 className="font-black text-kk-dark dark:text-white mt-6 mb-2">2.7 Suspensión y Cancelación de la Cuenta</h3>
            <p>Kuentas Klaras se reserva el derecho de suspender o cancelar cuentas en los siguientes casos:</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Violación de cualquiera de las cláusulas de estos Términos y Condiciones.</li>
              <li>Incumplimiento de normativas legales aplicables en Chile.</li>
              <li>Sospechas de actividades fraudulentas, previa investigación interna.</li>
            </ol>
            <p className="mt-2">
              En caso de suspensión o cancelación, te notificaremos por correo electrónico indicando las razones y ofreciendo la posibilidad de apelar la decisión dentro de los siguientes 5 días hábiles.
            </p>
          </Section>

          <Section number="3" title="Pago y Suscripción">
            <h3 className="font-black text-kk-dark dark:text-white mt-5 mb-2">3.1 Planes de Suscripción</h3>
            <p>
              Kuentas Klaras ofrece distintos planes de suscripción para acceder a sus servicios. Los detalles, costos y beneficios específicos están descritos dentro de la aplicación y en nuestro sitio web oficial.
            </p>

            <h3 className="font-black text-kk-dark dark:text-white mt-6 mb-2">3.2 Cobro Recurrente</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>El cobro de la suscripción corresponde a un monto mensual detallado en el plan contratado y puede variar con el tiempo. Este cobro se gestiona a través de un proveedor externo que acepta tarjetas de crédito, débito o prepago.</li>
              <li>El pago se realiza de forma recurrente el mismo día de cada mes, según la fecha de suscripción inicial.</li>
            </ul>

            <h3 className="font-black text-kk-dark dark:text-white mt-6 mb-2">3.3 Cancelación</h3>
            <p>
              No existe un período mínimo de permanencia. Puedes cancelar la suscripción en cualquier momento sin penalizaciones. Al cancelar, el servicio permanece activo hasta el final del período ya pagado. A partir de la siguiente fecha de facturación, no se realizarán nuevos cobros.
            </p>

            <h3 className="font-black text-kk-dark dark:text-white mt-6 mb-2">3.4 Reembolsos</h3>
            <p>
              Dado que la suscripción se paga por adelantado, no se efectuarán reembolsos por períodos no utilizados.
            </p>

            <h3 className="font-black text-kk-dark dark:text-white mt-6 mb-2">3.5 Falta de Pago</h3>
            <p>
              Si el cargo automático falla por saldo insuficiente o datos incorrectos, Kuentas Klaras podrá suspender temporalmente la cuenta hasta que se actualice el método de pago. De persistir la situación, la suscripción podría cancelarse, resultando en la posible pérdida de información.
            </p>
          </Section>

          <Section number="4" title="Limitación de Responsabilidad">
            <h3 className="font-black text-kk-dark dark:text-white mt-5 mb-2">4.1 Uso Informativo</h3>
            <p>
              Kuentas Klaras entrega información consolidada de gastos basada en los datos que ingresas o vinculas. Esta información es de carácter referencial y no constituye asesoría financiera, contable ni legal.
            </p>

            <h3 className="font-black text-kk-dark dark:text-white mt-6 mb-2">4.2 Exclusión de Garantías</h3>
            <p>
              Kuentas Klaras no garantiza que la aplicación esté libre de errores, interrupciones o fallas, pero se compromete a solucionar cualquier incidencia reportada en un plazo razonable.
            </p>

            <h3 className="font-black text-kk-dark dark:text-white mt-6 mb-2">4.3 Responsabilidad Limitada</h3>
            <p>En ningún caso Kuentas Klaras será responsable por:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Daños directos o indirectos derivados del uso de la aplicación.</li>
              <li>Pérdida de datos por negligencia del usuario o fallos en sistemas de terceros vinculados.</li>
              <li>Transacciones incorrectas generadas por información errónea proveniente del banco o ingresada por el usuario.</li>
            </ul>
          </Section>

          <Section number="5" title="Actualizaciones">
            <h3 className="font-black text-kk-dark dark:text-white mt-5 mb-2">5.1 Mejora Continua</h3>
            <p>
              Kuentas Klaras se reserva el derecho de realizar actualizaciones en la aplicación, tanto funcionales como de diseño, para mejorar tu experiencia o adaptarse a cambios regulatorios.
            </p>

            <h3 className="font-black text-kk-dark dark:text-white mt-6 mb-2">5.2 Cambios en estos Términos</h3>
            <p>
              Cualquier cambio en los presentes Términos y Condiciones será notificado con al menos 15 días de anticipación. El uso continuado de la aplicación después de dicha fecha implicará la aceptación de los cambios.
            </p>
          </Section>

          <Section number="6" title="Suspensión del Servicio">
            <p>
              Kuentas Klaras podrá suspender temporalmente el servicio por mantenimiento programado, problemas técnicos imprevistos o requerimientos legales o regulatorios.
            </p>
          </Section>

          <Section number="7" title="Seguridad de tus Datos">
            <p>
              En Kuentas Klaras, la seguridad de tus datos es nuestra prioridad. Implementamos medidas técnicas y organizativas para proteger tu información personal contra accesos no autorizados, pérdida o uso indebido. Para más detalles, revisa nuestra Política de Privacidad.
            </p>

            <h3 className="font-black text-kk-dark dark:text-white mt-6 mb-2">7.1 Uso de APIs de Servicios Externos de Inteligencia Artificial</h3>
            <p>
              Para brindar nuestros servicios, Kuentas Klaras utiliza APIs de servicios externos de inteligencia artificial. Aceptas que los datos personales compartidos podrán ser procesados por estos servicios de forma privada, de acuerdo con sus propias políticas de privacidad. Estos servicios pueden variar en el tiempo según las mejoras de la aplicación. Entre ellos se encuentran los modelos de lenguaje que operan en sesiones privadas ofrecidos por las siguientes empresas:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Google</li>
              <li>OpenAI</li>
              <li>Anthropic</li>
            </ul>
          </Section>

          <Section number="8" title="Comunicaciones">
            <p>
              Kuentas Klaras podrá enviarte, por cualquier medio disponible, recordatorios, encuestas, newsletters, notificaciones push y comunicaciones informativas con el objetivo de ofrecerte la mejor experiencia en la plataforma. Esto incluye, entre otros:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Información sobre nuevas funcionalidades.</li>
              <li>Consejos personalizados para mejorar el uso de la herramienta.</li>
              <li>Encuestas para recopilar comentarios que nos permitan mejorar el servicio.</li>
            </ul>
            <p className="mt-2">
              Puedes desuscribirte de estas comunicaciones desde la configuración de tu perfil en la aplicación. Para casos específicos, nos reservamos el derecho de contactarte por correo electrónico u otros canales cuando sea necesario para resolver situaciones particulares relacionadas con tu cuenta.
            </p>
          </Section>

          <Section number="9" title="Soporte">
            <h3 className="font-black text-kk-dark dark:text-white mt-5 mb-2">9.1 Atención al Cliente</h3>
            <p>
              El equipo de soporte de Kuentas Klaras está disponible para resolver tus dudas y problemas a través de los siguientes medios:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Correo electrónico: <a href="mailto:soporte@kuentasklaras.cl" className="text-kk-primary hover:underline font-black">soporte@kuentasklaras.cl</a></li>
              <li>Chat en la aplicación</li>
            </ul>
            <p className="mt-2">
              Nos comprometemos a responder las consultas dentro de un plazo máximo de 72 horas hábiles.
            </p>

            <h3 className="font-black text-kk-dark dark:text-white mt-6 mb-2">9.2 Autorización para Revisión de Información</h3>
            <p>
              Al solicitar ayuda a nuestro equipo de soporte, autorizas a Kuentas Klaras a contactarte y, si es necesario, revisar tu información de transacciones con el fin de brindarte la mejor asistencia posible. Esta revisión se realizará bajo estrictos protocolos de confidencialidad y de acuerdo con nuestras políticas de privacidad.
            </p>
          </Section>

          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-3 p-4 bg-kk-light/50 dark:bg-dark-lighter rounded-xl">
              <Shield className="text-kk-primary shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Si tienes preguntas sobre estos Términos y Condiciones, escríbenos a{' '}
                <a href="mailto:soporte@kuentasklaras.cl" className="text-kk-primary hover:underline font-black">
                  soporte@kuentasklaras.cl
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={onBack}
            className="text-sm text-slate-400 dark:text-slate-500 hover:text-kk-primary font-medium transition-colors"
          >
            ← Volver a la aplicación
          </button>
        </div>
      </div>
    </div>
  );
};

export default TerminosCondiciones;

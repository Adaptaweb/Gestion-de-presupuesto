// Registro con niveles.
//
// Los logs de diagnostico del pipeline de correos son utiles cuando un banco
// cambia su formato, pero llevan datos del usuario: asuntos de correo, nombres
// de comercio, importes, direcciones. En produccion quedan guardados en los
// logs de la plataforma, asi que van apagados salvo que se pidan de forma
// explicita con DEBUG_PARSING=1.
//
// Los errores se registran siempre y no deben incluir el cuerpo del correo ni
// datos personales: solo el motivo del fallo.

const DEBUG_ENABLED = process.env.DEBUG_PARSING === '1' || process.env.NODE_ENV === 'development';

export function logDebug(...args) {
  if (DEBUG_ENABLED) console.log(...args);
}

export function logInfo(...args) {
  console.log(...args);
}

export function logError(...args) {
  console.error(...args);
}

export const isDebugEnabled = DEBUG_ENABLED;

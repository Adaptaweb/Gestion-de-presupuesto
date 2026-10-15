// Tras un cambio del usuario (eliminar, editar, clasificar...) las lecturas de
// transacciones piden fresh=1 durante un minuto para saltar la cache del
// servidor: en Vercel otra instancia puede tener aun la lista anterior y la
// transaccion eliminada volvia a aparecer.
let ultimoCambio = 0;
const VENTANA_MS = 60000;

export const marcarCambioTx = () => { ultimoCambio = Date.now(); };

export const conFresco = (url) => (
  Date.now() - ultimoCambio < VENTANA_MS ? `${url}${url.includes('?') ? '&' : '?'}fresh=1` : url
);

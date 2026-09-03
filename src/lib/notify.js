// Notificaciones de guardado, error y carga.
//
// Antes cada pantalla tenia su propio aviso: Transacciones con `toast` y
// `statusMsg`, CategoriasConfig con su componente Toast, el resto sin nada.
// Todo pasa por aqui, sobre gooey-toast, para que el mismo tipo de accion se
// vea igual en toda la app.
import { toast, mountToaster } from 'gooey-toast';
import 'gooey-toast/styles.css';

// El fondo del toast es un SVG que se rellena a mano: no hereda del tema, asi
// que se resuelve en cada llamada leyendo la clase `dark` del documento.
const fill = () => (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  ? '#1F1F1F'
  : '#FFFFFF');

const base = () => ({ fill: fill(), timeoutIndicator: true });

export const initNotify = () => mountToaster({ position: 'top-center' });

export const notifyOk = (title, description) =>
  toast.success({ ...base(), title, description, duration: 3500 });

export const notifyError = (title, description) =>
  toast.error({ ...base(), title, description, duration: 6000 });

export const notifyInfo = (title, description) =>
  toast.info({ ...base(), title, description, duration: 4000 });

// Envuelve una operacion asincrona: muestra "guardando", y al terminar cambia
// el mismo toast a exito o error. `error` recibe la excepcion para poder
// mostrar el motivo real en vez de un texto generico.
export const notifyPromise = (promesa, { loading, ok, error }) =>
  toast.promise(promesa, {
    loading: { title: loading },
    success: () => ({ ...base(), title: ok, duration: 3500 }),
    error: (err) => ({
      ...base(),
      title: error,
      description: err?.message || undefined,
      duration: 6000,
    }),
  });

// El guardado del dashboard es automatico y con rebote: todas las acciones
// (crear, editar, marcar como pagado, eliminar) pasan por ahi. Comparten un id
// fijo para que el toast se transforme en vez de apilar uno por cada guardado.
const SYNC_ID = 'sync-dashboard';

// Antes cada handler mostraba su propio aviso ("Presupuesto guardado") y ademas
// el guardado automatico mostraba el suyo ("Guardando" y luego "Guardado"): dos
// notificaciones por una sola accion. Ahora el handler solo deja anotado el
// texto y el guardado automatico lo usa al confirmar, asi queda un unico toast
// con el mensaje especifico.
let etiquetaPendiente = null;

export const marcarGuardado = (title, description) => {
  etiquetaPendiente = { title, description };
};

const tomarEtiqueta = () => {
  const etiqueta = etiquetaPendiente;
  etiquetaPendiente = null;
  return etiqueta;
};

export const notifySaving = () =>
  toast.info({ ...base(), id: SYNC_ID, title: 'Guardando', duration: null });

export const notifySaved = () => {
  const etiqueta = tomarEtiqueta();
  return toast.success({
    ...base(),
    id: SYNC_ID,
    title: etiqueta?.title || 'Guardado',
    description: etiqueta?.description,
    duration: etiqueta ? 3500 : 2000,
  });
};

// Cuando el diff no encuentra cambios no hay peticion ni toast de guardado,
// pero el usuario si apreto guardar: se muestra la etiqueta igual para no
// dejarla colgada y que aparezca en el proximo guardado ajeno.
export const notifySavedSinCambios = () => {
  const etiqueta = tomarEtiqueta();
  if (!etiqueta) return;
  toast.success({ ...base(), id: SYNC_ID, title: etiqueta.title, description: etiqueta.description, duration: 3500 });
};

export const notifySaveError = (description) => {
  tomarEtiqueta();
  return toast.error({ ...base(), id: SYNC_ID, title: 'No se pudo guardar', description, duration: 6000 });
};

// Comparte el id del guardado para que el toast de "Guardando" se transforme en
// este aviso en vez de quedarse cargando para siempre.
export const notifySyncInfo = (title, description) => {
  tomarEtiqueta();
  return toast.info({ ...base(), id: SYNC_ID, title, description, duration: 4000 });
};

export { toast };

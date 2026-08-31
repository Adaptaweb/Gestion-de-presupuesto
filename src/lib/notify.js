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

export const notifySaving = () =>
  toast.info({ ...base(), id: SYNC_ID, title: 'Guardando', duration: null });

export const notifySaved = () =>
  toast.success({ ...base(), id: SYNC_ID, title: 'Guardado', duration: 2000 });

export const notifySaveError = (description) =>
  toast.error({ ...base(), id: SYNC_ID, title: 'No se pudo guardar', description, duration: 6000 });

export { toast };

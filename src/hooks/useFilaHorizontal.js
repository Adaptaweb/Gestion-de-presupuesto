import { useEffect, useRef } from 'react';

// Las filas que se desplazan de lado (categorias, chips de orden, filtros,
// tarjetas de banco) se hicieron para el dedo: llevan la barra oculta y en
// escritorio la rueda del raton solo mueve la pagina, asi que lo que sobresalia
// del ancho quedaba fuera de alcance salvo con teclado. Aqui la rueda vertical
// se traduce a desplazamiento horizontal.
const yaEnganchadas = new WeakSet();

function engancharRueda(fila) {
  if (!fila || yaEnganchadas.has(fila)) return;
  yaEnganchadas.add(fila);

  // El listener solo referencia a la fila, asi que se va con el nodo cuando
  // React lo desmonta: no hace falta retirarlo a mano.
  fila.addEventListener('wheel', (evento) => {
    // Un trackpad que ya manda desplazamiento horizontal se deja en paz.
    if (evento.deltaY === 0 || Math.abs(evento.deltaX) > Math.abs(evento.deltaY)) return;
    if (fila.scrollWidth <= fila.clientWidth) return;

    const antes = fila.scrollLeft;
    fila.scrollLeft += evento.deltaY;
    // En los extremos no se mueve nada: sin este corte la pagina se quedaria
    // atrapada detras de la fila en vez de seguir bajando.
    if (fila.scrollLeft !== antes) evento.preventDefault();
  }, { passive: false });
}

// Version para usar directamente como `ref` en filas sin seleccion.
export function refFilaHorizontal(fila) {
  engancharRueda(fila);
}

// Ademas de la rueda, coloca la fila sobre el elemento marcado con
// `data-seleccionado="true"`: al abrir una transaccion ya clasificada la
// categoria elegida podia estar fuera de vista y habia que buscarla a mano para
// saber cual era. `seleccion` es el valor que, al cambiar, vuelve a centrarla.
export function useFilaHorizontal(seleccion) {
  const ref = useRef(null);

  useEffect(() => {
    engancharRueda(ref.current);
  }, []);

  useEffect(() => {
    const fila = ref.current;
    if (!fila || seleccion === undefined) return;

    const activo = fila.querySelector('[data-seleccionado="true"]');
    if (!activo) return;

    // offsetLeft en vez de getBoundingClientRect: las tarjetas entran con una
    // animacion de escala y los rectangulos medidos a mitad de esa animacion
    // dan una posicion encogida.
    const base = activo.offsetParent === fila ? 0 : fila.offsetLeft;
    const centrado = activo.offsetLeft - base - (fila.clientWidth - activo.offsetWidth) / 2;
    const destino = Math.max(0, Math.min(centrado, fila.scrollWidth - fila.clientWidth));
    if (Math.abs(destino - fila.scrollLeft) < 2) return;

    // Salto, no animacion: la fila tiene que aparecer ya colocada al abrir la
    // transaccion, y `behavior: 'smooth'` se ignora por completo en los
    // entornos que desactivan animaciones, dejando la categoria fuera de vista.
    fila.scrollLeft = destino;
  }, [seleccion]);

  return ref;
}

export default useFilaHorizontal;

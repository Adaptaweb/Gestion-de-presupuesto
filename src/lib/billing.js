// Cliente del cobro: consulta el plan, abre el checkout y avisa cuando el
// servidor rechaza una escritura porque la cuenta esta en solo lectura.

const headers = (token) => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });

export async function fetchBilling(token) {
  const res = await fetch('/api/billing/estado', { headers: headers(token) });
  if (!res.ok) throw new Error('No se pudo consultar tu plan');
  return res.json();
}

export async function iniciarCheckout(token, plan) {
  const res = await fetch('/api/billing/checkout', { method: 'POST', headers: headers(token), body: JSON.stringify({ plan }) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.mensaje || data.error || 'No pudimos iniciar el pago');
    err.codigo = data.error;
    throw err;
  }
  return data.url;
}

export async function cancelarSuscripcion(token) {
  const res = await fetch('/api/billing/cancelar', { method: 'POST', headers: headers(token) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'No pudimos cancelar la suscripción');
  return data;
}

// El servidor responde 402 {error:'solo_lectura'} a las escrituras de una
// cuenta vencida. Se avisa a la app con un evento para abrir "Mi plan" una vez.
let instalado = false;
export function instalarInterceptorBilling() {
  if (instalado || typeof window === 'undefined') return;
  instalado = true;
  const original = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const res = await original(...args);
    if (res.status === 402) {
      res.clone().json().then((d) => {
        if (d?.error === 'solo_lectura') window.dispatchEvent(new CustomEvent('kk:solo-lectura', { detail: d }));
      }).catch(() => {});
    }
    return res;
  };
}

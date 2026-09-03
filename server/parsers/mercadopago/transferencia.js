import { BaseParser } from '../base.js';

// Mercado Pago avisa las transferencias desde info@mercadopago.cl con el
// beneficiario en una lista de etiquetas ("Nombre y apellido", "Entidad",
// "Numero de cuenta"). El parser generico se quedaba con la entidad —
// "Santander" — porque es lo que parece un nombre de banco; aqui el comercio es
// siempre la persona, y la entidad solo se usa para descartar.
export class MercadoPagoTransferenciaParser extends BaseParser {
  constructor() {
    super('MercadoPago.transferencia');
  }

  puedeParsear(html, headers) {
    const from = (headers?.from || '').toLowerCase();
    const esMercadoPago = from.includes('mercadopago') || from.includes('mercadolibre');
    if (!esMercadoPago) return false;
    return /transferencia|transferimos|transferiste/i.test(html);
  }

  extraer(html, headers) {
    const $ = this.loadHtml(html);
    const bodyText = $.text().replace(/\s+/g, ' ').trim();

    let monto = 0;
    const patronesMonto = [
      /transferencia\s+de\s*\$\s*([\d.,]{1,15})/i,
      /(?:enviamos|enviaste|recibiste|transferiste|recibimos)[^$]{0,40}\$\s*([\d.,]{1,15})/i,
      /Monto[\s:]*\$\s*([\d.,]{1,15})/i,
    ];
    for (const patron of patronesMonto) {
      const match = bodyText.match(patron);
      if (match) {
        monto = this.normalizarMonto(match[1]);
        if (monto) break;
      }
    }

    let fecha = this.normalizarFecha(bodyText.match(/(\d{2}[/-]\d{2}[/-]\d{4})/)?.[1]);
    if (!fecha) fecha = this.fechaEnPalabras(bodyText);
    // Estos avisos suelen no llevar fecha en el cuerpo, solo la hora. Sin fecha
    // la transaccion se descarta entera, asi que se usa la del correo, que en
    // una notificacion push del banco es el mismo dia del movimiento.
    if (!fecha) fecha = this.fechaDelCorreo(headers);

    const comercio = this.simplifyComercio(this.extraerContraparte(bodyText));

    // "Ya enviamos tu transferencia" es salida de dinero; "recibiste" entrada.
    const esEntrada = /recibiste|te\s+transfirieron|te\s+envi(?:o|ó|aron)|acreditamos|ya\s+recibimos/i.test(bodyText);

    return {
      banco: 'MercadoPago',
      tipo_movimiento: 'Transferencia',
      tipo_tarjeta: '',
      monto,
      fecha,
      comercio,
      tipo_transaccion: esEntrada ? 'ingreso' : 'gasto',
    };
  }

  // El nombre va etiquetado; "Entidad" y "Numero de cuenta" son las etiquetas
  // que siguen, y sirven de corte para no arrastrarlas dentro del nombre.
  extraerContraparte(bodyText) {
    const patrones = [
      /Nombre\s+y\s+apellido[:\s]+(.+?)(?=\s*(?:Entidad|Banco|N[uú]mero\s+de\s+cuenta|RUT|Rut|Email|Monto|Motivo|$))/i,
      /Nombre\s+(?:del\s+)?(?:beneficiario|destinatario|remitente)[:\s]+(.+?)(?=\s*(?:Entidad|Banco|N[uú]mero\s+de\s+cuenta|RUT|Rut|Email|Monto|Motivo|$))/i,
      /(?:Datos\s+del\s+)?(?:beneficiario|destinatario)[:\s]+(.+?)(?=\s*(?:Entidad|Banco|N[uú]mero\s+de\s+cuenta|RUT|Rut|Email|Monto|Motivo|$))/i,
    ];
    for (const patron of patrones) {
      const match = bodyText.match(patron);
      if (match && match[1]) return match[1];
    }
    return '';
  }

  fechaEnPalabras(bodyText) {
    const meses = {
      enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
      julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
    };
    const match = bodyText.match(/(\d{1,2})\s+de\s+([a-záéíóú]+)(?:\s+del?\s+(\d{4}))?/i);
    if (!match) return null;
    const mes = meses[match[2].toLowerCase()];
    if (!mes) return null;
    const anio = match[3] || String(new Date().getFullYear());
    return `${anio}-${mes}-${match[1].padStart(2, '0')}`;
  }

  fechaDelCorreo(headers) {
    const raw = headers?.date || headers?.Date;
    if (!raw) return null;
    const d = new Date(raw);
    if (isNaN(d.getTime())) return null;

    // La fecha se toma en el huso del propio correo, no en UTC: un aviso de las
    // 21:00 en Chile (-04) cae al dia siguiente en UTC y el movimiento quedaba
    // fechado un dia despues.
    const offset = String(raw).match(/([+-])(\d{2})(\d{2})\s*$/);
    let ms = d.getTime();
    if (offset) {
      const minutos = Number(offset[2]) * 60 + Number(offset[3]);
      ms += (offset[1] === '-' ? -minutos : minutos) * 60000;
    }
    return new Date(ms).toISOString().slice(0, 10);
  }

  simplifyComercio(raw) {
    if (!raw) return '';
    let name = String(raw).trim();
    name = name.replace(/^(a|para|de|del)\s+/i, '');
    name = name.replace(/[,;:|.]+$/g, '');
    name = name.replace(/\s+/g, ' ').trim();
    if (name.length < 2) return '';
    return name;
  }
}

export default MercadoPagoTransferenciaParser;

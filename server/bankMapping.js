export const BANK_SENDERS = {
  'BICE': ['info.bice.cl', 'bancobice.cl', 'eeccvirtual.cl'],
  'Banco Chile': ['bancochile.cl', 'bancoedwards.cl'],
  'Falabella': ['bancofalabella.cl', 'cmr.cl'],
  'Santander': ['santander.cl'],
  'BCI': ['bci.cl', 'eeccvirtual.cl', 'bciplus.cl', 'tarjetaliderbci.cl'],
  'Itau': ['itau.cl', 'eeccvirtual.cl'],
  'Scotiabank': ['eeccdigital.cl', 'scotiabank.cl'],
  'Tenpo': ['tenpo.cl', 'tenpobank.cl'],
  'Mach': ['machbank.cl', 'somosmach.com'],
  'Banco Estado': ['bancoestado.cl', 'correo.bancoestado.cl'],
  'MercadoPago': ['mercadopago.com'],
  'BancoConsorcio': ['bancoconsorcio.cl'],
  'Banco Ripley': ['bancoripley.cl', 'bancoripley.com'],
  'Banco Security': ['bancosecurity.cl'],
  'Copec': ['copecpay.cl'],
  'Global66': ['global66.com'],
  'Héroes Prepago': ['heroesprepago.cl', 'losheroes.cl'],
  'Infotapp': ['infotapp.cl'],
  'Los Andes Prepago': ['losandesprepago.cl'],
  'Fintual': ['fintual.com'],
  'Cencosud': ['cencosudscotiabank.cl'],
  'MetroMuv': ['metromuv.cl'],
  'Prex': ['prexcard.cl'],
  'Banco Internacional': ['internacional.cl', 'eeccvirtual.cl'],
};

export const BANK_ALIASES = {
  'bancobice': 'BICE',
  'bice': 'BICE',
  'banco chile': 'Banco Chile',
  'bancochile': 'Banco Chile',
  'falabella': 'Falabella',
  'santander': 'Santander',
  'bci': 'BCI',
  'itau': 'Itau',
  'scotiabank': 'Scotiabank',
  'tenpo': 'Tenpo',
  'mach': 'Mach',
  'banco estado': 'Banco Estado',
  'bancoestado': 'Banco Estado',
  'mercadopago': 'MercadoPago',
  'banco consorcio': 'BancoConsorcio',
  'banco Rip': 'Banco Ripley',
  'banco security': 'Banco Security',
  'copec': 'Copec',
  'global': 'Global66',
  'heroes': 'Héroes Prepago',
  'infotapp': 'Infotapp',
  'los andes': 'Los Andes Prepago',
  'fintual': 'Fintual',
  'cencosud': 'Cencosud',
  'metromuv': 'MetroMuv',
  'prex': 'Prex',
  'banco internacional': 'Banco Internacional',
};

export function detectBankFromSender(fromAddress) {
  if (!fromAddress) return 'Otros';
  const normalized = fromAddress.toLowerCase();
  for (const [bank, domains] of Object.entries(BANK_SENDERS)) {
    for (const domain of domains) {
      if (normalized.includes(domain)) {
        return bank;
      }
    }
  }
  return 'Otros';
}

export function getSendersForBank(bank) {
  return BANK_SENDERS[bank] || [];
}

export function normalizeBankName(name) {
  if (!name) return 'Otros';
  const normalized = name.toLowerCase().trim();
  return BANK_ALIASES[normalized] || name;
}

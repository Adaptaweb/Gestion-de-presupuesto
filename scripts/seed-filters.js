import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../server/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const USER_ID = process.argv[2];
if (!USER_ID) {
  console.error('Uso: node scripts/seed-filters.js <user_id>');
  process.exit(1);
}

const REMITENTES = [
  'reply@info.bice.cl',
  'biceinforma@bancobice.cl',
  'bancobice@eeccvirtual.cl',
  'serviciodetransferencias@bancochile.cl',
  'enviodigital@bancochile.cl',
  'notificaciones@bancochile.cl',
  'enviodigital@bancoedwards.cl',
  'serviciotransferencias@bancochile.cl',
  'cartoladigital@bancofalabella.cl',
  'estadodecuenta@cmr.cl',
  'notificaciones@cl.bancofalabella.com',
  'mensajeria@santander.cl',
  'mensajes@santander.cl',
  'bdp@santander.cl',
  'contacto@bci.cl',
  'transferencias@bci.cl',
  'bcimail@bci.cl',
  'bci@eeccvirtual.cl',
  'notificaciones@bciplus.cl',
  'itau@eeccvirtual.cl',
  'transferencias@itau.cl',
  'itaupersonas@itau.cl',
  'cartola@itau.cl',
  'scotiabank@eeccdigital.cl',
  'avisos.info@scotiabank.cl',
  'cartolas.info@scotiabank.cl',
  'avisos.empresa.info@scotiabank.cl',
  'comprobantes.info@scotiabank.cl',
  'no-reply@tenpo.cl',
  'no-reply@tenpobank.cl',
  'inversiones@tenpo.cl',
  'no-reply@mail.machbank.cl',
  'contacto@mail.machbank.cl',
  'contacto@mail.somosmach.com',
  'noreply@somosmach.com',
  'estadodecuenta@correo.tarjetaliderbci.cl',
  'bancoestado@correo.bancoestado.cl',
  'bancoestado@eeccvirtual.cl',
  'notificaciones@correo.bancoestado.cl',
  'noreply@correo.bancoestado.cl',
  'info@mercadopago.com',
  'bancoconsorcio@bancoconsorcio.cl',
  'mensajes@bancoconsorcio.cl',
  'bancoripleyinforma@bancoripley.com',
  'informaciones@bancoripley.cl',
  'noresponder@bancosecurity.cl',
  'notificaciones@transaccionalcoopeuch.com',
  'mensajeria@copecpay.cl',
  'contacto@mail.global66.com',
  'no-reply@sender.global66.com',
  'mensajeria@heroesprepago.cl',
  'transferenciaprepago@losheroes.cl',
  'operaciones@infotapp.cl',
  'no.reply@losandesprepago.cl',
  'hola@fintual.com',
  'notificaciones@cencosudscotiabank.cl',
  'donotreply@metromuv.cl',
  'info@prexcard.cl',
  'bancointernacional@internacional.cl',
  'bancointernacional@eeccvirtual.cl',
  'no-reply@internacional.cl',
  'transferencias@transferencias.internacional.cl',
];

async function seed() {
  console.log(`Reemplazando filtros para usuario: ${USER_ID}`);

  await db.run('DELETE FROM filtros_correo WHERE user_id = ?', USER_ID);

  let inserted = 0;
  for (const remitente of REMITENTES) {
    const id = `filtro-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await db.run(
      'INSERT INTO filtros_correo (id, user_id, remitente, asunto) VALUES (?, ?, ?, NULL)',
      id, USER_ID, remitente
    );
    inserted++;
  }

  console.log(`Insertados ${inserted} filtros.`);

  const config = await db.get('SELECT dias_atras FROM config_extraccion WHERE user_id = ?', USER_ID);
  console.log(`dias_atras actual: ${config?.dias_atras ?? 3}`);

  process.exit(0);
}

seed().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

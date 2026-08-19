// Separa el campo name en nombre y apellido para los usuarios anteriores al
// registro con nombre y apellido, y los da por verificados.
//
// En JavaScript y no en SQL porque la columna name puede no existir en
// instalaciones nuevas: si falta, no hay nada que rellenar.

export default async function run(db) {
  const hasName = await db.get(
    `SELECT 1 FROM information_schema.columns
     WHERE table_name = 'users' AND column_name = 'name'`
  );
  if (!hasName) return 'la columna name no existe: nada que rellenar';

  const users = await db.all('SELECT id, name, email FROM users WHERE nombre IS NULL');

  for (const user of users) {
    const parts = (user.name || '').trim().split(/\s+/).filter(Boolean);
    const nombre = parts[0] || user.email.split('@')[0];
    const apellido = parts.slice(1).join(' ');
    await db.run(
      'UPDATE users SET nombre = ?, apellido = ?, email_verified = TRUE WHERE id = ?',
      nombre, apellido, user.id
    );
  }

  return `usuarios rellenados: ${users.length}`;
}

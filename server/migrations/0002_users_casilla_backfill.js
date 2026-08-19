// Genera la casilla de correo de los usuarios que aun no tienen una.
//
// Sigue en JavaScript porque necesita reintentar ante colision: la casilla es
// unica y se construye a partir del correo mas un sufijo aleatorio.

export default async function run(db) {
  const users = await db.all('SELECT id, email FROM users WHERE casilla IS NULL');

  for (const user of users) {
    const localPart = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    let base = localPart.slice(0, 4);
    while (base.length < 4) {
      base += Math.random().toString(36).slice(2, 3);
    }

    let casilla = base;
    let attempts = 0;
    while (attempts < 10) {
      const existing = await db.get('SELECT 1 FROM users WHERE casilla = ?', casilla);
      if (!existing) break;
      casilla = base + Math.floor(100 + Math.random() * 900).toString();
      attempts++;
    }

    await db.run('UPDATE users SET casilla = ? WHERE id = ?', casilla, user.id);
  }

  return `casillas generadas: ${users.length}`;
}

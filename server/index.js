import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'gestion-presupuesto-secret-key-2025';

const app = express();
app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Requiere permisos de administrador' });
  next();
};

// AUTH: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Todos los campos son requeridos' });

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'El email ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    const role = userCount.count === 0 ? 'admin' : 'user';

    db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)').run(
      id, name, email, hashedPassword, role
    );

    const token = jwt.sign({ id, email, name, role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id, name, email, role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// AUTH: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son requeridos' });

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Credenciales inválidas' });

    if (user.blocked) return res.status(403).json({ error: 'Usuario bloqueado. Contacta al administrador.' });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// AUTH: Verify
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ user });
});

// ADMIN: Get all users
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, email, role, blocked, created_at FROM users ORDER BY created_at DESC').all();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// ADMIN: Update user role
app.put('/api/admin/users/:id/role', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) return res.status(400).json({ error: 'Rol inválido' });
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
});

// ADMIN: Delete user
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// ADMIN: Create user
app.post('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'El email ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const userRole = role || 'user';

    db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)').run(
      id, name, email, hashedPassword, userRole
    );

    res.json({ success: true, user: { id, name, email, role: userRole, blocked: 0 } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// ADMIN: Block/Unblock user
app.put('/api/admin/users/:id/block', authenticateToken, requireAdmin, (req, res) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ error: 'No puedes bloquearte a ti mismo' });
    const user = db.prepare('SELECT blocked FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const newBlocked = user.blocked ? 0 : 1;
    db.prepare('UPDATE users SET blocked = ? WHERE id = ?').run(newBlocked, req.params.id);
    res.json({ success: true, blocked: newBlocked });
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar estado del usuario' });
  }
});

// ADMIN: Reset user password
app.put('/api/admin/users/:id/password', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ error: 'Contraseña requerida' });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al resetear contraseña' });
  }
});

// DATA: Get all data for authenticated user
app.get('/api/data', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const months = db.prepare('SELECT mes FROM meses WHERE user_id = ?').all(userId).map(m => m.mes);
    
    const deudasRows = db.prepare('SELECT * FROM deudas WHERE user_id = ?').all(userId);
    const pagosDeudasRows = db.prepare('SELECT pd.* FROM pagos_deudas pd JOIN deudas d ON pd.deuda_id = d.id WHERE d.user_id = ?').all(userId);
    const deudas = deudasRows.map(d => {
      const pagos = {};
      pagosDeudasRows.filter(p => p.deuda_id === d.id).forEach(p => { pagos[p.mes] = { estado: p.estado }; });
      return { ...d, isContribuciones: Boolean(d.isContribuciones), pagos };
    });

    const gastosRows = db.prepare('SELECT * FROM gastos_fijos WHERE user_id = ?').all(userId);
    const pagosGastosRows = db.prepare('SELECT pg.* FROM pagos_gastos pg JOIN gastos_fijos g ON pg.gasto_id = g.id WHERE g.user_id = ?').all(userId);
    const gastosFijos = gastosRows.map(g => {
      const pagos = {};
      pagosGastosRows.filter(p => p.gasto_id === g.id).forEach(p => { pagos[p.mes] = { monto: p.monto, estado: p.estado }; });
      return { ...g, pagos };
    });

    const sueldosRows = db.prepare('SELECT mes, monto FROM sueldos WHERE user_id = ?').all(userId);
    const sueldos = {};
    sueldosRows.forEach(s => sueldos[s.mes] = s.monto);

    const cuentasAhorro = db.prepare('SELECT * FROM cuentas_ahorro WHERE user_id = ?').all(userId);
    const ahorrosDataRows = db.prepare('SELECT ad.* FROM ahorros_data ad JOIN cuentas_ahorro c ON ad.cuenta_id = c.id WHERE c.user_id = ?').all(userId);
    const ahorrosData = {};
    ahorrosDataRows.forEach(a => {
      if (!ahorrosData[a.cuenta_id]) ahorrosData[a.cuenta_id] = {};
      ahorrosData[a.cuenta_id][a.mes] = { deposito: a.deposito, gasto: a.gasto };
    });

    res.json({ months, deudas, gastosFijos, sueldos, cuentasAhorro, ahorrosData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error loading data' });
  }
});

// DATA: Full sync for authenticated user
app.post('/api/sync', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { deudas, months, gastosFijos, sueldos, cuentasAhorro, ahorrosData } = req.body;
  
  db.exec('BEGIN TRANSACTION');
  try {
    if (months) {
      db.prepare('DELETE FROM meses WHERE user_id = ?').run(userId);
      const insertMonth = db.prepare('INSERT INTO meses (id, user_id, mes) VALUES (?, ?, ?)');
      for (let i = 0; i < months.length; i++) insertMonth.run(`month-${userId}-${i}`, userId, months[i]);
    }
    
    if (deudas) {
      db.prepare('DELETE FROM deudas WHERE user_id = ?').run(userId);
      const insertDeuda = db.prepare('INSERT INTO deudas (id, user_id, descripcion, cuotasTotales, valorCuota, mesInicio, isContribuciones) VALUES (?, ?, ?, ?, ?, ?, ?)');
      const insertPagoDeuda = db.prepare('INSERT INTO pagos_deudas (deuda_id, mes, estado) VALUES (?, ?, ?)');
      for (const d of deudas) {
        insertDeuda.run(d.id, userId, d.descripcion, d.cuotasTotales, d.valorCuota, d.mesInicio, d.isContribuciones ? 1 : 0);
        if (d.pagos) {
          for (const [mes, pago] of Object.entries(d.pagos)) {
            insertPagoDeuda.run(d.id, mes, pago.estado);
          }
        }
      }
    }

    if (gastosFijos) {
      db.prepare('DELETE FROM gastos_fijos WHERE user_id = ?').run(userId);
      const insertGasto = db.prepare('INSERT INTO gastos_fijos (id, user_id, descripcion, iconType, iconValue, iconUrl) VALUES (?, ?, ?, ?, ?, ?)');
      const insertPagoGasto = db.prepare('INSERT INTO pagos_gastos (gasto_id, mes, monto, estado) VALUES (?, ?, ?, ?)');
      for (const g of gastosFijos) {
        insertGasto.run(g.id, userId, g.descripcion, g.iconType, g.iconValue, g.iconUrl);
        if (g.pagos) {
          for (const [mes, pago] of Object.entries(g.pagos)) {
            insertPagoGasto.run(g.id, mes, pago.monto, pago.estado);
          }
        }
      }
    }

    if (sueldos) {
      db.prepare('DELETE FROM sueldos WHERE user_id = ?').run(userId);
      const insertSueldo = db.prepare('INSERT INTO sueldos (id, user_id, mes, monto) VALUES (?, ?, ?, ?)');
      let i = 0;
      for (const [mes, monto] of Object.entries(sueldos)) {
        insertSueldo.run(`sueldo-${userId}-${i++}`, userId, mes, monto);
      }
    }

    if (cuentasAhorro) {
      db.prepare('DELETE FROM cuentas_ahorro WHERE user_id = ?').run(userId);
      const insertCuenta = db.prepare('INSERT INTO cuentas_ahorro (id, user_id, nombre, banco) VALUES (?, ?, ?, ?)');
      for (const c of cuentasAhorro) {
        insertCuenta.run(c.id, userId, c.nombre, c.banco);
      }
    }

    if (ahorrosData) {
      db.prepare('DELETE FROM ahorros_data WHERE id IN (SELECT ad.id FROM ahorros_data ad JOIN cuentas_ahorro c ON ad.cuenta_id = c.id WHERE c.user_id = ?)').run(userId);
      const insertAhorro = db.prepare('INSERT INTO ahorros_data (id, cuenta_id, mes, deposito, gasto) VALUES (?, ?, ?, ?, ?)');
      let i = 0;
      for (const [cuentaId, data] of Object.entries(ahorrosData)) {
        for (const [mes, a] of Object.entries(data)) {
          insertAhorro.run(`ahorro-${userId}-${i++}`, cuentaId, mes, a.deposito || 0, a.gasto || 0);
        }
      }
    }

    db.exec('COMMIT');
    res.json({ success: true });
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('Error syncing data:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});

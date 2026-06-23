import React, { useState, useEffect } from 'react';
import { Users, Shield, Trash2, Key, X, Loader2, ArrowLeft, Mail, Ban, CheckCircle, UserPlus, Eye, EyeOff } from 'lucide-react';

const AdminPanel = ({ onBack, token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPassword, setEditingPassword] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [showPassword, setShowPassword] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleToggleRole = async (user) => {
    setActionLoading(true);
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch(`/api/admin/users/${user.id}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      setError('Error al cambiar rol');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`)) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Error al eliminar usuario');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (userId) => {
    if (!newPassword || newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      });
      if (res.ok) {
        setEditingPassword(null);
        setNewPassword('');
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Error al resetear contraseña');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      setError('Todos los campos son requeridos');
      return;
    }
    if (newUser.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        setShowCreateModal(false);
        setNewUser({ name: '', email: '', password: '', role: 'user' });
        setShowPassword(false);
        fetchUsers();
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Error al crear usuario');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleBlock = async (user) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/block`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(users.map(u => u.id === user.id ? { ...u, blocked: data.blocked } : u));
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Error al cambiar estado del usuario');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-darker p-4 md:p-8 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
                <Users className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Panel de Administración</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Gestión de usuarios</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
          >
            <UserPlus size={18} /> Nuevo Usuario
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-xl text-sm font-bold flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError('')}><X size={16} /></button>
          </div>
        )}

        <div className="bg-white dark:bg-dark-normal rounded-[2rem] shadow-2xl shadow-slate-200 dark:shadow-dark-darker/50 border border-slate-200 dark:border-dark-lighter overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {users.map(user => (
                <div key={user.id} className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${user.blocked ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl">
                      <Mail className="text-indigo-600 dark:text-indigo-400" size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-800 dark:text-slate-200">{user.name}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          user.role === 'admin'
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-dark-lighter text-slate-500 dark:text-slate-400'
                        }`}>
                          {user.role === 'admin' && <Shield size={10} className="inline mr-1" />}
                          {user.role}
                        </span>
                        {user.blocked === 1 && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 flex items-center gap-1">
                            <Ban size={10} /> Bloqueado
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-400">{user.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-16 md:ml-0">
                    <button
                      onClick={() => handleToggleBlock(user)}
                      disabled={actionLoading}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
                        user.blocked
                          ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/40'
                          : 'bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/40'
                      }`}
                    >
                      {user.blocked ? <CheckCircle size={14} /> : <Ban size={14} />}
                      {user.blocked ? 'Desbloquear' : 'Bloquear'}
                    </button>

                    <button
                      onClick={() => handleToggleRole(user)}
                      disabled={actionLoading}
                      className="flex items-center gap-1.5 bg-slate-100 dark:bg-dark-lighter hover:bg-slate-200 dark:hover:bg-dark-lightest text-slate-600 dark:text-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    >
                      <Shield size={14} />
                      {user.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                    </button>

                    <button
                      onClick={() => setEditingPassword(editingPassword === user.id ? null : user.id)}
                      disabled={actionLoading}
                      className="p-2 bg-slate-100 dark:bg-dark-lighter hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-xl transition-all disabled:opacity-50"
                    >
                      <Key size={14} />
                    </button>

                    <button
                      onClick={() => handleDeleteUser(user)}
                      disabled={actionLoading}
                      className="p-2 bg-slate-100 dark:bg-dark-lighter hover:bg-rose-100 dark:hover:bg-rose-900/30 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-xl transition-all disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {editingPassword === user.id && (
                    <div className="mt-3 p-4 bg-slate-50 dark:bg-dark-lighter/50 rounded-xl flex flex-col sm:flex-row gap-2">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nueva contraseña (min 6 caracteres)"
                        className="flex-1 bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lightest rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-indigo-500 dark:text-slate-200"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          disabled={actionLoading}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => { setEditingPassword(null); setNewPassword(''); }}
                          className="bg-slate-200 dark:bg-dark-lightest text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-black hover:bg-slate-300 dark:hover:bg-dark-lightest transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-normal rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black flex items-center gap-2 text-slate-900 dark:text-white">
                <UserPlus className="text-indigo-600" size={24} /> Nuevo Usuario
              </h3>
              <button onClick={() => { setShowCreateModal(false); setNewUser({ name: '', email: '', password: '', role: 'user' }); setShowPassword(false); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Nombre</label>
                <input
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-4 py-3 font-bold outline-none focus:border-indigo-500 transition-all dark:text-slate-200"
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Correo electrónico</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-4 py-3 font-bold outline-none focus:border-indigo-500 transition-all dark:text-slate-200"
                  placeholder="usuario@email.com"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-4 py-3 pr-12 font-bold outline-none focus:border-indigo-500 transition-all dark:text-slate-200"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Rol</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewUser({ ...newUser, role: 'user' })}
                    className={`py-3 rounded-xl text-sm font-black border-2 transition-all ${
                      newUser.role === 'user'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-100 dark:border-dark-lighter text-slate-400'
                    }`}
                  >
                    Usuario
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewUser({ ...newUser, role: 'admin' })}
                    className={`py-3 rounded-xl text-sm font-black border-2 transition-all ${
                      newUser.role === 'admin'
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        : 'border-slate-100 dark:border-dark-lighter text-slate-400'
                    }`}
                  >
                    Administrador
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30 hover:bg-indigo-700 transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <><UserPlus size={18} /> Crear Usuario</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AdminPanel;


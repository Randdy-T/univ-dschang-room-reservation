import { useState } from 'react';
import {
  Users, Plus, Pencil, Trash2, Search,
  Filter, Shield, CheckCircle, XCircle,
  AlertCircle, X, Eye, EyeOff, Loader2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ─── Données de simulation ────────────────────────────────────────────────────
// Respecte le diagramme IAM : User + Role + UserRole

const initialUsers = [
  { id: 1, username: 'dr.tagne', email: 'prof@uds.cm', phone: '+237 699 000 001', role: 'TEACHER', status: 'ACTIVE', createdAt: '2025-09-01', lastLogin: '2026-05-24' },
  { id: 2, username: 'jean.kamga', email: 'etudiant@uds.cm', phone: '+237 699 000 002', role: 'STUDENT', status: 'ACTIVE', createdAt: '2025-09-15', lastLogin: '2026-05-23' },
  { id: 3, username: 'admin.uds', email: 'admin@uds.cm', phone: '+237 699 000 003', role: 'ADMIN', status: 'ACTIVE', createdAt: '2025-08-01', lastLogin: '2026-05-24' },
  { id: 4, username: 'pr.mbarga', email: 'chef@uds.cm', phone: '+237 699 000 004', role: 'HEAD_OF_DEPT', status: 'ACTIVE', createdAt: '2025-09-01', lastLogin: '2026-05-20' },
  { id: 5, username: 'dr.nguetsop', email: 'nguetsop@uds.cm', phone: '+237 699 000 005', role: 'TEACHER', status: 'INACTIVE', createdAt: '2025-09-01', lastLogin: '2026-04-10' },
  { id: 6, username: 'marie.fopa', email: 'fopa@uds.cm', phone: '+237 699 000 006', role: 'STUDENT', status: 'BLOCKED', createdAt: '2025-10-01', lastLogin: '2026-03-05' },
  { id: 7, username: 'pr.kamdem', email: 'kamdem@uds.cm', phone: '+237 699 000 007', role: 'HEAD_OF_DEPT', status: 'ACTIVE', createdAt: '2025-09-01', lastLogin: '2026-05-22' },
  { id: 8, username: 'alice.njoya', email: 'njoya@uds.cm', phone: '+237 699 000 008', role: 'STUDENT', status: 'ACTIVE', createdAt: '2025-10-05', lastLogin: '2026-05-21' },
]
// ─── Configs ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  ACTIVE: { label: 'Actif', color: 'bg-green-100 text-green-700', dot: 'bg-green-500', icon: CheckCircle },
  INACTIVE: { label: 'Inactif', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', icon: AlertCircle },
  BLOCKED: { label: 'Bloqué', color: 'bg-red-100 text-red-600', dot: 'bg-red-500', icon: XCircle },
};

const ROLE_CONFIG = {
  ADMIN: { label: 'Administrateur', color: 'bg-red-100 text-red-700' },
  TEACHER: { label: 'Enseignant', color: 'bg-uds-blue/10 text-uds-blue' },
  STUDENT: { label: 'Étudiant', color: 'bg-purple-100 text-purple-700' },
  HEAD_OF_DEPT: { label: 'Chef de département', color: 'bg-orange-100 text-uds-orange' },
};

const ROLE_COLORS_AVATAR = {
  ADMIN: 'bg-red-500',
  TEACHER: 'bg-uds-blue',
  STUDENT: 'bg-purple-500',
  HEAD_OF_DEPT: 'bg-uds-orange',
};

// ─── Schema validation ────────────────────────────────────────────────────────

const userSchema = z.object({
  username: z.string().min(3, 'Nom d\'utilisateur requis (min 3 caractères)'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(9, 'Téléphone requis'),
  role: z.string().min(1, 'Rôle requis'),
  status: z.string().min(1, 'Statut requis'),
  password: z.string().optional(),
});

// ─── Composant principal ──────────────────────────────────────────────────────

export default function UsersManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [modal, setModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [detailUser, setDetailUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(userSchema),
  });

  // ── Filtrage ───────────────────────────────────────────────────────────────

  const filtered = users.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    const matchStatus = filterStatus === 'ALL' || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const counts = {
    total: users.length,
    ACTIVE: users.filter(u => u.status === 'ACTIVE').length,
    INACTIVE: users.filter(u => u.status === 'INACTIVE').length,
    BLOCKED: users.filter(u => u.status === 'BLOCKED').length,
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const openAddModal = () => {
    reset({});
    setShowPassword(false);
    setModal({ mode: 'add' });
  };

  const openEditModal = (user) => {
    reset({
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    });
    setShowPassword(false);
    setModal({ mode: 'edit', data: user });
  };

  const onSubmit = (data) => {
    if (modal.mode === 'add') {
      const newUser = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: '—',
      };
      setUsers((prev) => [...prev, newUser]);
      showToast('Utilisateur créé avec succès.');
    } else {
      setUsers((prev) =>
        prev.map((u) => u.id === modal.data.id ? { ...u, ...data } : u)
      );
      showToast('Utilisateur modifié avec succès.');
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('Utilisateur supprimé.', 'error');
    setDeleteModal(null);
  };

  const handleStatusChange = (id, newStatus) => {
    // Appel API → IAM Service : updateUserStatus(id, newStatus)
    setUsers((prev) =>
      prev.map((u) => u.id === id ? { ...u, status: newStatus } : u)
    );
    setDetailUser((prev) => prev ? { ...prev, status: newStatus } : null);
    showToast(`Statut mis à jour : ${STATUS_CONFIG[newStatus].label}`);
  };

  const getInitials = (username) => {
    return username.split('.').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const ROLE_COLORS_AVATAR = {
    ADMIN: 'bg-red-500',
    ENSEIGNANT: 'bg-uds-blue',
    ETUDIANT: 'bg-purple-500',
    DOYEN: 'bg-uds-orange',
    HEAD_OF_DEPT: 'bg-yellow-500',
  };

  // ── Rendu ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
          {toast.message}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-uds-blue">Gestion des utilisateurs</h1>
          <p className="text-uds-gray-dark text-sm mt-1">
            {users.length} utilisateur(s) au total
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-uds-orange text-white font-semibold text-sm hover:bg-uds-orange-light transition-all shadow-md"
        >
          <Plus size={16} /> Nouvel utilisateur
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: counts.total, color: 'bg-uds-blue', icon: Users },
          { label: 'Actifs', value: counts.ACTIVE, color: 'bg-green-500', icon: CheckCircle },
          { label: 'Inactifs', value: counts.INACTIVE, color: 'bg-gray-400', icon: AlertCircle },
          { label: 'Bloqués', value: counts.BLOCKED, color: 'bg-red-500', icon: XCircle },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={20} className="text-white" />
              </div>
              <p className="text-3xl font-bold text-uds-blue">{stat.value}</p>
              <p className="text-sm font-medium text-gray-700 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-uds-blue" />
          <p className="text-sm font-bold text-uds-blue">Filtres</p>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-uds-gray-dark" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-uds-gray outline-none focus:border-uds-blue transition-all text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Filtre rôle */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'ALL', label: 'Tous les rôles' },
              { key: 'ADMIN', label: 'Admin' },
              { key: 'ENSEIGNANT', label: 'Enseignant' },
              { key: 'ETUDIANT', label: 'Étudiant' },
              { key: 'HEAD_OF_DEPT', label: 'Chef dept / Doyen' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterRole(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  filterRole === f.key
                    ? 'bg-uds-blue text-white border-uds-blue'
                    : 'bg-uds-gray text-uds-gray-dark border-gray-100 hover:border-uds-blue'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Filtre statut */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'ALL', label: 'Tous les statuts' },
              { key: 'ACTIVE', label: 'Actif' },
              { key: 'INACTIVE', label: 'Inactif' },
              { key: 'BLOCKED', label: 'Bloqué' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  filterStatus === f.key
                    ? 'bg-uds-orange text-white border-uds-orange'
                    : 'bg-uds-gray text-uds-gray-dark border-gray-100 hover:border-uds-orange'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste utilisateurs */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-uds-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-uds-gray-dark" />
          </div>
          <p className="text-uds-blue font-bold text-lg">Aucun utilisateur trouvé</p>
          <p className="text-uds-gray-dark text-sm mt-1">Modifiez vos filtres ou créez un nouvel utilisateur</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-uds-blue text-left">
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wide">Utilisateur</th>
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wide">Email</th>
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wide">Rôle</th>
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wide">Statut</th>
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wide">Dernière connexion</th>
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => {
                  const status = STATUS_CONFIG[user.status];
                  const role = ROLE_CONFIG[user.role];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={user.id} className="hover:bg-uds-gray/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${ROLE_COLORS_AVATAR[user.role]}`}>
                            {getInitials(user.username)}
                          </div>
                          <div>
                            <p className="font-bold text-uds-blue text-sm">{user.username}</p>
                            <p className="text-xs text-uds-gray-dark">{user.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${role.color}`}>
                          {role.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}>
                          <StatusIcon size={11} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{user.lastLogin}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDetailUser(user)}
                            className="p-2 rounded-lg hover:bg-uds-blue hover:text-white text-uds-gray-dark border border-gray-200 transition-all"
                            title="Voir détails"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 rounded-lg hover:bg-uds-blue hover:text-white text-uds-gray-dark border border-gray-200 transition-all"
                            title="Modifier"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteModal(user)}
                            className="p-2 rounded-lg hover:bg-red-500 hover:text-white text-uds-gray-dark border border-gray-200 transition-all"
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal formulaire */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-uds-blue text-lg">
                {modal.mode === 'add' ? 'Nouvel utilisateur' : 'Modifier l\'utilisateur'}
              </h3>
              <button onClick={() => setModal(null)} className="p-2 rounded-xl hover:bg-uds-gray text-uds-gray-dark">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Nom d'utilisateur
                </label>
                <input
                  {...register('username')}
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm"
                  placeholder="ex: dr.tagne"
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm"
                  placeholder="ex: nom@uds.cm"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Téléphone</label>
                <input
                  {...register('phone')}
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm"
                  placeholder="ex: +237 699 000 000"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              {modal.mode === 'add' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-uds-gray-dark hover:text-uds-blue"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Rôle</label>
                  <select
                    {...register('role')}
                    className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm"
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="ADMIN">Administrateur</option>
                    <option value="ENSEIGNANT">Enseignant</option>
                    <option value="ETUDIANT">Étudiant</option>
                    <option value="HEAD_OF_DEPT">Chef de département / Doyen</option>
                  </select>
                  {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Statut</label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm"
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="ACTIVE">Actif</option>
                    <option value="INACTIVE">Inactif</option>
                    <option value="BLOCKED">Bloqué</option>
                  </select>
                  {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-uds-orange text-white font-bold text-sm hover:bg-uds-orange-light transition-all shadow-md mt-2"
              >
                {modal.mode === 'add' ? 'Créer l\'utilisateur' : 'Enregistrer les modifications'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal détail utilisateur */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-uds-blue rounded-t-2xl px-6 py-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${ROLE_COLORS_AVATAR[detailUser.role]}`}>
                    {getInitials(detailUser.username)}
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{detailUser.username}</p>
                    <p className="text-blue-200 text-sm">{detailUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setDetailUser(null)} className="text-blue-200 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-uds-gray rounded-xl p-3">
                  <p className="text-xs text-uds-gray-dark font-medium">Rôle</p>
                  <span className={`inline-block text-xs font-bold px-2 py-1 rounded-full mt-1 ${ROLE_CONFIG[detailUser.role].color}`}>
                    {ROLE_CONFIG[detailUser.role].label}
                  </span>
                </div>
                <div className="bg-uds-gray rounded-xl p-3">
                  <p className="text-xs text-uds-gray-dark font-medium">Téléphone</p>
                  <p className="text-sm font-bold text-uds-blue mt-1">{detailUser.phone}</p>
                </div>
                <div className="bg-uds-gray rounded-xl p-3">
                  <p className="text-xs text-uds-gray-dark font-medium">Créé le</p>
                  <p className="text-sm font-bold text-uds-blue mt-1">{detailUser.createdAt}</p>
                </div>
                <div className="bg-uds-gray rounded-xl p-3">
                  <p className="text-xs text-uds-gray-dark font-medium">Dernière connexion</p>
                  <p className="text-sm font-bold text-uds-blue mt-1">{detailUser.lastLogin}</p>
                </div>
              </div>

              {/* Changer statut */}
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Changer le statut
                </p>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(STATUS_CONFIG).map(([key, val]) => {
                    const Icon = val.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => handleStatusChange(detailUser.id, key)}
                        disabled={detailUser.status === key}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                          detailUser.status === key
                            ? 'border-uds-blue bg-uds-blue text-white cursor-not-allowed'
                            : `border-gray-100 hover:border-uds-orange ${val.color}`
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${val.dot}`} />
                        {val.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setDetailUser(null); openEditModal(detailUser); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-uds-blue text-uds-blue font-bold text-sm hover:bg-uds-blue hover:text-white transition-all"
                >
                  <Pencil size={14} /> Modifier
                </button>
                <button
                  onClick={() => { setDetailUser(null); setDeleteModal(detailUser); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-red-200 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal suppression */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="text-uds-blue font-bold text-lg mb-2">Supprimer l'utilisateur ?</h3>
            <p className="text-uds-gray-dark text-sm mb-6">
              Supprimer <span className="font-bold text-uds-blue">{deleteModal.username}</span> ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-uds-gray transition-all"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteModal.id)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
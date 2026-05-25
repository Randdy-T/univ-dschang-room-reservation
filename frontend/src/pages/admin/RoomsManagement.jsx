import { useState } from 'react';
import {
  DoorOpen, Plus, Pencil, Trash2, Search,
  Filter, Users, CheckCircle, Wrench, XCircle,
  X, ChevronDown
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ─── Données de simulation ────────────────────────────────────────────────────

const initialRooms = [
  { id: 1, code: 'AMP-1000', name: 'Amphi 1000', building: 'Bâtiment A', campus: 'Campus Principal', capacity: 1000, type: 'AMPHITHEATRE', status: 'AVAILABLE', equipments: ['Projecteur', 'Micro', 'Climatisation'] },
  { id: 2, code: 'AMP-500', name: 'Amphi 500', building: 'Bâtiment A', campus: 'Campus Principal', capacity: 500, type: 'AMPHITHEATRE', status: 'AVAILABLE', equipments: ['Projecteur', 'Micro'] },
  { id: 3, code: 'S-204', name: 'Salle 204', building: 'Bâtiment B', campus: 'Campus Principal', capacity: 60, type: 'CLASSROOM', status: 'MAINTENANCE', equipments: ['Tableau', 'Projecteur'] },
  { id: 4, code: 'S-101', name: 'Salle 101', building: 'Bâtiment A', campus: 'Campus Principal', capacity: 80, type: 'CLASSROOM', status: 'OUT_OF_SERVICE', equipments: ['Tableau'] },
  { id: 5, code: 'LAB-1', name: 'Labo Info 1', building: 'Bâtiment C', campus: 'Campus Principal', capacity: 40, type: 'LABORATORY', status: 'AVAILABLE', equipments: ['Ordinateurs', 'Projecteur'] },
  { id: 6, code: 'LAB-2', name: 'Labo Info 2', building: 'Bâtiment C', campus: 'Campus Principal', capacity: 35, type: 'LABORATORY', status: 'AVAILABLE', equipments: ['Ordinateurs'] },
  { id: 7, code: 'S-305', name: 'Salle 305', building: 'Bâtiment B', campus: 'Campus Principal', capacity: 50, type: 'CLASSROOM', status: 'AVAILABLE', equipments: ['Tableau', 'Climatisation'] },
  { id: 8, code: 'AMP-200', name: 'Amphi 200', building: 'Bâtiment D', campus: 'Campus Principal', capacity: 200, type: 'AMPHITHEATRE', status: 'AVAILABLE', equipments: ['Projecteur', 'Micro', 'Climatisation'] },
];

// ─── Configs ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  AVAILABLE: { label: 'Disponible', color: 'bg-green-100 text-green-700', dot: 'bg-green-500', icon: CheckCircle },
  MAINTENANCE: { label: 'Maintenance', color: 'bg-orange-100 text-uds-orange', dot: 'bg-uds-orange', icon: Wrench },
  OUT_OF_SERVICE: { label: 'Hors service', color: 'bg-red-100 text-red-600', dot: 'bg-red-500', icon: XCircle },
};

const TYPE_CONFIG = {
  AMPHITHEATRE: { label: 'Amphithéâtre', color: 'bg-uds-blue/10 text-uds-blue' },
  CLASSROOM: { label: 'Salle de cours', color: 'bg-purple-100 text-purple-700' },
  LABORATORY: { label: 'Laboratoire', color: 'bg-green-100 text-green-700' },
};

const EQUIPMENTS_LIST = [
  'Projecteur', 'Tableau', 'Micro', 'Climatisation',
  'Ordinateurs', 'Caméra', 'Système audio', 'Wifi',
];

// ─── Schema validation ────────────────────────────────────────────────────────

const roomSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  code: z.string().min(2, 'Code requis'),
  capacity: z.string().min(1, 'Capacité requise'),
  type: z.string().min(1, 'Type requis'),
  status: z.string().min(1, 'Statut requis'),
  building: z.string().min(2, 'Bâtiment requis'),
});

// ─── Composant principal ──────────────────────────────────────────────────────

export default function RoomsManagement() {
  const [rooms, setRooms] = useState(initialRooms);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [modal, setModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [toast, setToast] = useState(null);
  const [detailRoom, setDetailRoom] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(roomSchema),
  });

  // ── Filtrage ───────────────────────────────────────────────────────────────

  const filtered = rooms.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.building.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || r.type === filterType;
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const counts = {
    ALL: rooms.length,
    AVAILABLE: rooms.filter(r => r.status === 'AVAILABLE').length,
    MAINTENANCE: rooms.filter(r => r.status === 'MAINTENANCE').length,
    OUT_OF_SERVICE: rooms.filter(r => r.status === 'OUT_OF_SERVICE').length,
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const openAddModal = () => {
    reset({});
    setSelectedEquipments([]);
    setModal({ mode: 'add' });
  };

  const openEditModal = (room) => {
    reset({
      name: room.name,
      code: room.code,
      capacity: String(room.capacity),
      type: room.type,
      status: room.status,
      building: room.building,
    });
    setSelectedEquipments(room.equipments || []);
    setModal({ mode: 'edit', data: room });
  };

  const toggleEquipment = (eq) => {
    setSelectedEquipments((prev) =>
      prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]
    );
  };

  const onSubmit = (data) => {
    if (modal.mode === 'add') {
      const newRoom = {
        id: Date.now(),
        ...data,
        capacity: parseInt(data.capacity),
        campus: 'Campus Principal',
        equipments: selectedEquipments,
      };
      setRooms((prev) => [...prev, newRoom]);
      showToast('Salle ajoutée avec succès.');
    } else {
      setRooms((prev) =>
        prev.map((r) => r.id === modal.data.id
          ? { ...r, ...data, capacity: parseInt(data.capacity), equipments: selectedEquipments }
          : r
        )
      );
      showToast('Salle modifiée avec succès.');
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    showToast('Salle supprimée.', 'error');
    setDeleteModal(null);
  };

  const handleStatusChange = (id, newStatus) => {
    setRooms((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: newStatus } : r)
    );
    showToast(`Statut mis à jour : ${STATUS_CONFIG[newStatus].label}`);
    setDetailRoom((prev) => prev ? { ...prev, status: newStatus } : null);
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
          <h1 className="text-2xl font-bold text-uds-blue">Gestion des salles</h1>
          <p className="text-uds-gray-dark text-sm mt-1">
            {rooms.length} salle(s) au total
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-uds-orange text-white font-semibold text-sm hover:bg-uds-orange-light transition-all shadow-md"
        >
          <Plus size={16} /> Nouvelle salle
        </button>
      </div>

      {/* Stats par statut */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: 'ALL', label: 'Total', color: 'bg-uds-blue' },
          { key: 'AVAILABLE', label: 'Disponibles', color: 'bg-green-500' },
          { key: 'MAINTENANCE', label: 'Maintenance', color: 'bg-uds-orange' },
          { key: 'OUT_OF_SERVICE', label: 'Hors service', color: 'bg-red-500' },
        ].map((s) => (
          <div key={s.key} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <DoorOpen size={20} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-uds-blue">{counts[s.key]}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Filter size={16} className="text-uds-blue" />
          <p className="text-sm font-bold text-uds-blue">Filtres</p>
        </div>

        {/* Recherche */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-uds-gray-dark" />
          <input
            type="text"
            placeholder="Rechercher par nom, code ou bâtiment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-uds-gray outline-none focus:border-uds-blue transition-all text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Filtre type */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'ALL', label: 'Tous les types' },
              { key: 'AMPHITHEATRE', label: 'Amphithéâtre' },
              { key: 'CLASSROOM', label: 'Salle de cours' },
              { key: 'LABORATORY', label: 'Laboratoire' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  filterType === f.key
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
              { key: 'AVAILABLE', label: 'Disponible' },
              { key: 'MAINTENANCE', label: 'Maintenance' },
              { key: 'OUT_OF_SERVICE', label: 'Hors service' },
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

      {/* Résultats */}
      <p className="text-sm text-uds-gray-dark font-medium">
        {filtered.length} salle(s) trouvée(s)
      </p>

      {/* Tableau des salles */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-uds-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <DoorOpen size={28} className="text-uds-gray-dark" />
          </div>
          <p className="text-uds-blue font-bold text-lg">Aucune salle trouvée</p>
          <p className="text-uds-gray-dark text-sm mt-1">Modifiez vos filtres ou ajoutez une nouvelle salle</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-uds-blue text-left">
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wide">Salle</th>
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wide">Bâtiment</th>
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wide">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wide">Capacité</th>
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wide">Statut</th>
                  <th className="px-6 py-4 text-xs font-semibold text-blue-200 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((room) => {
                  const status = STATUS_CONFIG[room.status];
                  const type = TYPE_CONFIG[room.type];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={room.id} className="hover:bg-uds-gray/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-uds-blue text-sm">{room.name}</p>
                        <p className="text-xs text-uds-gray-dark mt-0.5">{room.code}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{room.building}</p>
                        <p className="text-xs text-uds-gray-dark">{room.campus}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${type.color}`}>
                          {type.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <Users size={14} className="text-uds-gray-dark" />
                          {room.capacity}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}>
                          <StatusIcon size={11} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDetailRoom(room)}
                            className="p-2 rounded-lg hover:bg-uds-blue hover:text-white text-uds-gray-dark border border-gray-200 transition-all"
                            title="Voir détails"
                          >
                            <ChevronDown size={14} />
                          </button>
                          <button
                            onClick={() => openEditModal(room)}
                            className="p-2 rounded-lg hover:bg-uds-blue hover:text-white text-uds-gray-dark border border-gray-200 transition-all"
                            title="Modifier"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteModal(room)}
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

      {/* Modal formulaire ajout/édition */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-uds-blue text-lg">
                {modal.mode === 'add' ? 'Nouvelle salle' : 'Modifier la salle'}
              </h3>
              <button onClick={() => setModal(null)} className="p-2 rounded-xl hover:bg-uds-gray text-uds-gray-dark">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nom</label>
                  <input {...register('name')} className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm" placeholder="ex: Amphi 1000" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Code</label>
                  <input {...register('code')} className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm" placeholder="ex: AMP-1000" />
                  {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Bâtiment</label>
                <input {...register('building')} className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm" placeholder="ex: Bâtiment A" />
                {errors.building && <p className="text-red-500 text-xs mt-1">{errors.building.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Capacité</label>
                <input type="number" {...register('capacity')} className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm" placeholder="ex: 100" />
                {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Type</label>
                  <select {...register('type')} className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm">
                    <option value="">-- Sélectionner --</option>
                    <option value="AMPHITHEATRE">Amphithéâtre</option>
                    <option value="CLASSROOM">Salle de cours</option>
                    <option value="LABORATORY">Laboratoire</option>
                  </select>
                  {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Statut</label>
                  <select {...register('status')} className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm">
                    <option value="">-- Sélectionner --</option>
                    <option value="AVAILABLE">Disponible</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="OUT_OF_SERVICE">Hors service</option>
                  </select>
                  {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
                </div>
              </div>

              {/* Équipements */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Équipements</label>
                <div className="flex flex-wrap gap-2">
                  {EQUIPMENTS_LIST.map((eq) => (
                    <button
                      key={eq}
                      type="button"
                      onClick={() => toggleEquipment(eq)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        selectedEquipments.includes(eq)
                          ? 'bg-uds-blue text-white border-uds-blue'
                          : 'bg-uds-gray text-uds-gray-dark border-gray-100 hover:border-uds-blue'
                      }`}
                    >
                      {eq}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-uds-orange text-white font-bold text-sm hover:bg-uds-orange-light transition-all shadow-md mt-2">
                {modal.mode === 'add' ? 'Ajouter la salle' : 'Enregistrer les modifications'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal détail salle */}
      {detailRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-uds-blue rounded-t-2xl px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-bold text-xl">{detailRoom.name}</p>
                  <p className="text-blue-200 text-sm mt-0.5">{detailRoom.code}</p>
                </div>
                <button onClick={() => setDetailRoom(null)} className="text-blue-200 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-uds-gray rounded-xl p-3">
                  <p className="text-xs text-uds-gray-dark font-medium">Bâtiment</p>
                  <p className="text-sm font-bold text-uds-blue mt-1">{detailRoom.building}</p>
                </div>
                <div className="bg-uds-gray rounded-xl p-3">
                  <p className="text-xs text-uds-gray-dark font-medium">Capacité</p>
                  <p className="text-sm font-bold text-uds-blue mt-1">{detailRoom.capacity} places</p>
                </div>
                <div className="bg-uds-gray rounded-xl p-3">
                  <p className="text-xs text-uds-gray-dark font-medium">Type</p>
                  <p className="text-sm font-bold text-uds-blue mt-1">{TYPE_CONFIG[detailRoom.type].label}</p>
                </div>
                <div className="bg-uds-gray rounded-xl p-3">
                  <p className="text-xs text-uds-gray-dark font-medium">Statut actuel</p>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full mt-1 ${STATUS_CONFIG[detailRoom.status].color}`}>
                    {STATUS_CONFIG[detailRoom.status].label}
                  </span>
                </div>
              </div>

              {/* Équipements */}
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Équipements</p>
                <div className="flex flex-wrap gap-2">
                  {detailRoom.equipments?.map((eq) => (
                    <span key={eq} className="text-xs bg-uds-blue/10 text-uds-blue px-2 py-1 rounded-full font-medium">{eq}</span>
                  ))}
                </div>
              </div>

              {/* Changer statut */}
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Changer le statut</p>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => handleStatusChange(detailRoom.id, key)}
                      disabled={detailRoom.status === key}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                        detailRoom.status === key
                          ? 'border-uds-blue bg-uds-blue text-white cursor-not-allowed'
                          : `border-gray-100 hover:border-uds-orange hover:bg-orange-50 ${val.color}`
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${val.dot}`} />
                      {val.label}
                    </button>
                  ))}
                </div>
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
            <h3 className="text-uds-blue font-bold text-lg mb-2">Supprimer la salle ?</h3>
            <p className="text-uds-gray-dark text-sm mb-6">
              Supprimer <span className="font-bold text-uds-blue">{deleteModal.name}</span> ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-uds-gray transition-all">
                Annuler
              </button>
              <button onClick={() => handleDelete(deleteModal.id)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
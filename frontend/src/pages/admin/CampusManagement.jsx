import { useState } from 'react';
import {
  Building2, MapPin, Plus, Pencil, Trash2,
  ChevronDown, ChevronRight, DoorOpen, X,
  CheckCircle, Users
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ─── Données de simulation ────────────────────────────────────────────────────
// Respecte la hiérarchie du diagramme : Campus → Building → Room

const initialCampuses = [
  {
    id: 1,
    name: 'Campus Principal',
    location: 'Dschang',
    city: 'Dschang',
    buildings: [
      {
        id: 1, name: 'Bâtiment A', code: 'BAT-A', campusId: 1,
        rooms: [
          { id: 1, code: 'AMP-1000', name: 'Amphi 1000', capacity: 1000, type: 'AMPHITHEATRE', status: 'AVAILABLE' },
          { id: 2, code: 'AMP-500', name: 'Amphi 500', capacity: 500, type: 'AMPHITHEATRE', status: 'AVAILABLE' },
          { id: 3, code: 'S-101', name: 'Salle 101', capacity: 80, type: 'CLASSROOM', status: 'OUT_OF_SERVICE' },
        ],
      },
      {
        id: 2, name: 'Bâtiment B', code: 'BAT-B', campusId: 1,
        rooms: [
          { id: 4, code: 'S-204', name: 'Salle 204', capacity: 60, type: 'CLASSROOM', status: 'MAINTENANCE' },
          { id: 5, code: 'S-305', name: 'Salle 305', capacity: 50, type: 'CLASSROOM', status: 'AVAILABLE' },
        ],
      },
      {
        id: 3, name: 'Bâtiment C', code: 'BAT-C', campusId: 1,
        rooms: [
          { id: 6, code: 'LAB-1', name: 'Labo Info 1', capacity: 40, type: 'LABORATORY', status: 'AVAILABLE' },
          { id: 7, code: 'LAB-2', name: 'Labo Info 2', capacity: 35, type: 'LABORATORY', status: 'AVAILABLE' },
        ],
      },
    ],
  },
];

// ─── Configs ──────────────────────────────────────────────────────────────────

const ROOM_STATUS_CONFIG = {
  AVAILABLE: { label: 'Disponible', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  MAINTENANCE: { label: 'Maintenance', color: 'bg-orange-100 text-uds-orange', dot: 'bg-uds-orange' },
  OUT_OF_SERVICE: { label: 'Hors service', color: 'bg-red-100 text-red-600', dot: 'bg-red-500' },
};

const ROOM_TYPE_LABELS = {
  AMPHITHEATRE: 'Amphithéâtre',
  CLASSROOM: 'Salle de cours',
  LABORATORY: 'Laboratoire',
};

// ─── Schemas de validation ────────────────────────────────────────────────────

const campusSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  location: z.string().min(2, 'Localisation requise'),
  city: z.string().min(2, 'Ville requise'),
});

const buildingSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  code: z.string().min(2, 'Code requis'),
});

const roomSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  code: z.string().min(2, 'Code requis'),
  capacity: z.string().min(1, 'Capacité requise'),
  type: z.string().min(1, 'Type requis'),
  status: z.string().min(1, 'Statut requis'),
});

// ─── Sous-composants ──────────────────────────────────────────────────────────

function FormModal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-uds-blue text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-uds-gray text-uds-gray-dark transition-all">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function DeleteModal({ message, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={28} className="text-red-500" />
        </div>
        <h3 className="text-uds-blue font-bold text-lg mb-2">Confirmer la suppression</h3>
        <p className="text-uds-gray-dark text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-uds-gray transition-all"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function CampusManagement() {
  const [campuses, setCampuses] = useState(initialCampuses);
  const [expandedCampus, setExpandedCampus] = useState(1);
  const [expandedBuilding, setExpandedBuilding] = useState(null);
  const [toast, setToast] = useState(null);

  // Modals
  const [modal, setModal] = useState(null);
  // modal = { type: 'campus'|'building'|'room', mode: 'add'|'edit', data, campusId?, buildingId? }
  const [deleteModal, setDeleteModal] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // ── Formulaire campus ──────────────────────────────────────────────────────

  const CampusForm = ({ defaultValues, onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: zodResolver(campusSchema),
      defaultValues,
    });
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nom du campus</label>
          <input {...register('name')} className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm" placeholder="ex: Campus Principal" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Localisation</label>
          <input {...register('location')} className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm" placeholder="ex: Centre-ville" />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Ville</label>
          <input {...register('city')} className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm" placeholder="ex: Dschang" />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>
        <button type="submit" className="w-full py-3 rounded-xl bg-uds-blue text-white font-bold text-sm hover:bg-uds-blue-light transition-all mt-2">
          Enregistrer
        </button>
      </form>
    );
  };

  // ── Formulaire bâtiment ────────────────────────────────────────────────────

  const BuildingForm = ({ defaultValues, onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: zodResolver(buildingSchema),
      defaultValues,
    });
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nom du bâtiment</label>
          <input {...register('name')} className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm" placeholder="ex: Bâtiment A" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Code</label>
          <input {...register('code')} className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm" placeholder="ex: BAT-A" />
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
        </div>
        <button type="submit" className="w-full py-3 rounded-xl bg-uds-blue text-white font-bold text-sm hover:bg-uds-blue-light transition-all mt-2">
          Enregistrer
        </button>
      </form>
    );
  };

  // ── Formulaire salle ───────────────────────────────────────────────────────

  const RoomForm = ({ defaultValues, onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: zodResolver(roomSchema),
      defaultValues,
    });
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
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
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Capacité</label>
          <input type="number" {...register('capacity')} className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm" placeholder="ex: 100" />
          {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>}
        </div>
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
        <button type="submit" className="w-full py-3 rounded-xl bg-uds-blue text-white font-bold text-sm hover:bg-uds-blue-light transition-all mt-2">
          Enregistrer
        </button>
      </form>
    );
  };

  // ── Handlers campus ────────────────────────────────────────────────────────

  const handleSaveCampus = (data) => {
    if (modal.mode === 'add') {
      const newCampus = {
        id: Date.now(), ...data, buildings: [],
      };
      setCampuses((prev) => [...prev, newCampus]);
      showToast('Campus ajouté avec succès.');
    } else {
      setCampuses((prev) =>
        prev.map((c) => c.id === modal.data.id ? { ...c, ...data } : c)
      );
      showToast('Campus modifié avec succès.');
    }
    setModal(null);
  };

  const handleDeleteCampus = (id) => {
    setCampuses((prev) => prev.filter((c) => c.id !== id));
    showToast('Campus supprimé.');
    setDeleteModal(null);
  };

  // ── Handlers bâtiment ──────────────────────────────────────────────────────

  const handleSaveBuilding = (data) => {
    if (modal.mode === 'add') {
      const newBuilding = { id: Date.now(), ...data, campusId: modal.campusId, rooms: [] };
      setCampuses((prev) =>
        prev.map((c) => c.id === modal.campusId
          ? { ...c, buildings: [...c.buildings, newBuilding] }
          : c
        )
      );
      showToast('Bâtiment ajouté avec succès.');
    } else {
      setCampuses((prev) =>
        prev.map((c) => ({
          ...c,
          buildings: c.buildings.map((b) =>
            b.id === modal.data.id ? { ...b, ...data } : b
          ),
        }))
      );
      showToast('Bâtiment modifié avec succès.');
    }
    setModal(null);
  };

  const handleDeleteBuilding = (campusId, buildingId) => {
    setCampuses((prev) =>
      prev.map((c) => c.id === campusId
        ? { ...c, buildings: c.buildings.filter((b) => b.id !== buildingId) }
        : c
      )
    );
    showToast('Bâtiment supprimé.');
    setDeleteModal(null);
  };

  // ── Handlers salle ─────────────────────────────────────────────────────────

  const handleSaveRoom = (data) => {
    if (modal.mode === 'add') {
      const newRoom = {
        id: Date.now(),
        name: data.name,
        code: data.code,
        capacity: parseInt(data.capacity),
        type: data.type,
        status: data.status,
      };
      setCampuses((prev) =>
        prev.map((c) => ({
          ...c,
          buildings: c.buildings.map((b) =>
            b.id === modal.buildingId
              ? { ...b, rooms: [...b.rooms, newRoom] }
              : b
          ),
        }))
      );
      showToast('Salle ajoutée avec succès.');
    } else {
      setCampuses((prev) =>
        prev.map((c) => ({
          ...c,
          buildings: c.buildings.map((b) => ({
            ...b,
            rooms: b.rooms.map((r) =>
              r.id === modal.data.id
                ? { ...r, ...data, capacity: parseInt(data.capacity) }
                : r
            ),
          })),
        }))
      );
      showToast('Salle modifiée avec succès.');
    }
    setModal(null);
  };

  const handleDeleteRoom = (buildingId, roomId) => {
    setCampuses((prev) =>
      prev.map((c) => ({
        ...c,
        buildings: c.buildings.map((b) =>
          b.id === buildingId
            ? { ...b, rooms: b.rooms.filter((r) => r.id !== roomId) }
            : b
        ),
      }))
    );
    showToast('Salle supprimée.');
    setDeleteModal(null);
  };

  // ── Rendu ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold bg-green-600">
          <CheckCircle size={18} /> {toast}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-uds-blue">Campus & Bâtiments</h1>
          <p className="text-uds-gray-dark text-sm mt-1">
            Gérez la hiérarchie Campus → Bâtiments → Salles
          </p>
        </div>
        <button
          onClick={() => setModal({ type: 'campus', mode: 'add' })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-uds-orange text-white font-semibold text-sm hover:bg-uds-orange-light transition-all shadow-md"
        >
          <Plus size={16} /> Nouveau campus
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Campus', value: campuses.length, icon: MapPin, color: 'bg-uds-blue' },
          { label: 'Bâtiments', value: campuses.reduce((acc, c) => acc + c.buildings.length, 0), icon: Building2, color: 'bg-uds-orange' },
          { label: 'Salles', value: campuses.reduce((acc, c) => acc + c.buildings.reduce((a, b) => a + b.rooms.length, 0), 0), icon: DoorOpen, color: 'bg-green-500' },
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

      {/* Liste campus */}
      <div className="space-y-4">
        {campuses.map((campus) => (
          <div key={campus.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Header campus */}
            <div
              className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-uds-gray transition-colors"
              onClick={() => setExpandedCampus(expandedCampus === campus.id ? null : campus.id)}
            >
              <div className="flex items-center gap-3">
                {expandedCampus === campus.id
                  ? <ChevronDown size={20} className="text-uds-blue" />
                  : <ChevronRight size={20} className="text-uds-gray-dark" />
                }
                <div className="w-10 h-10 bg-uds-blue rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-uds-blue">{campus.name}</p>
                  <p className="text-xs text-uds-gray-dark">
                    {campus.location} · {campus.city} · {campus.buildings.length} bâtiment(s)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setModal({ type: 'building', mode: 'add', campusId: campus.id })}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-uds-blue/10 text-uds-blue text-xs font-bold hover:bg-uds-blue hover:text-white transition-all"
                >
                  <Plus size={12} /> Bâtiment
                </button>
                <button
                  onClick={() => setModal({ type: 'campus', mode: 'edit', data: campus })}
                  className="p-2 rounded-lg hover:bg-uds-gray text-uds-gray-dark hover:text-uds-blue transition-all"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteModal({ message: `Supprimer le campus "${campus.name}" et tous ses bâtiments ?`, onConfirm: () => handleDeleteCampus(campus.id) })}
                  className="p-2 rounded-lg hover:bg-red-50 text-uds-gray-dark hover:text-red-500 transition-all"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Bâtiments */}
            {expandedCampus === campus.id && (
              <div className="border-t border-gray-100">
                {campus.buildings.length === 0 ? (
                  <div className="px-8 py-6 text-center text-uds-gray-dark text-sm">
                    Aucun bâtiment — cliquez sur "+ Bâtiment" pour en ajouter un.
                  </div>
                ) : (
                  campus.buildings.map((building) => (
                    <div key={building.id} className="border-b border-gray-50 last:border-0">

                      {/* Header bâtiment */}
                      <div
                        className="flex items-center justify-between px-8 py-3.5 cursor-pointer hover:bg-uds-gray/50 transition-colors"
                        onClick={() => setExpandedBuilding(expandedBuilding === building.id ? null : building.id)}
                      >
                        <div className="flex items-center gap-3">
                          {expandedBuilding === building.id
                            ? <ChevronDown size={16} className="text-uds-blue" />
                            : <ChevronRight size={16} className="text-uds-gray-dark" />
                          }
                          <div className="w-8 h-8 bg-uds-orange/10 rounded-lg flex items-center justify-center">
                            <Building2 size={15} className="text-uds-orange" />
                          </div>
                          <div>
                            <p className="font-semibold text-uds-blue text-sm">{building.name}</p>
                            <p className="text-xs text-uds-gray-dark">
                              Code : {building.code} · {building.rooms.length} salle(s)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setModal({ type: 'room', mode: 'add', campusId: campus.id, buildingId: building.id })}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-uds-orange/10 text-uds-orange text-xs font-bold hover:bg-uds-orange hover:text-white transition-all"
                          >
                            <Plus size={12} /> Salle
                          </button>
                          <button
                            onClick={() => setModal({ type: 'building', mode: 'edit', data: building, campusId: campus.id })}
                            className="p-1.5 rounded-lg hover:bg-uds-gray text-uds-gray-dark hover:text-uds-blue transition-all"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ message: `Supprimer le bâtiment "${building.name}" et toutes ses salles ?`, onConfirm: () => handleDeleteBuilding(campus.id, building.id) })}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-uds-gray-dark hover:text-red-500 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Salles */}
                      {expandedBuilding === building.id && (
                        <div className="px-10 pb-4">
                          {building.rooms.length === 0 ? (
                            <p className="text-center text-uds-gray-dark text-sm py-4">
                              Aucune salle — cliquez sur "+ Salle" pour en ajouter une.
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                              {building.rooms.map((room) => {
                                const status = ROOM_STATUS_CONFIG[room.status];
                                return (
                                  <div key={room.id} className="bg-uds-gray rounded-xl p-4 flex items-start justify-between border border-gray-100">
                                    <div className="flex items-start gap-3">
                                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${status.dot}`} />
                                      <div>
                                        <p className="font-bold text-uds-blue text-sm">{room.name}</p>
                                        <p className="text-xs text-uds-gray-dark">{room.code}</p>
                                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                          <span className="text-xs bg-uds-blue/10 text-uds-blue px-2 py-0.5 rounded-full font-medium">
                                            {ROOM_TYPE_LABELS[room.type]}
                                          </span>
                                          <span className="flex items-center gap-1 text-xs text-uds-gray-dark">
                                            <Users size={11} /> {room.capacity}
                                          </span>
                                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
                                            {status.label}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                      <button
                                        onClick={() => setModal({ type: 'room', mode: 'edit', data: { ...room, capacity: String(room.capacity) }, buildingId: building.id })}
                                        className="p-1.5 rounded-lg hover:bg-white text-uds-gray-dark hover:text-uds-blue transition-all"
                                      >
                                        <Pencil size={13} />
                                      </button>
                                      <button
                                        onClick={() => setDeleteModal({ message: `Supprimer la salle "${room.name}" ?`, onConfirm: () => handleDeleteRoom(building.id, room.id) })}
                                        className="p-1.5 rounded-lg hover:bg-white text-uds-gray-dark hover:text-red-500 transition-all"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals formulaires */}
      {modal?.type === 'campus' && (
        <FormModal
          title={modal.mode === 'add' ? 'Nouveau campus' : 'Modifier le campus'}
          onClose={() => setModal(null)}
        >
          <CampusForm
            defaultValues={modal.data || {}}
            onSubmit={handleSaveCampus}
          />
        </FormModal>
      )}

      {modal?.type === 'building' && (
        <FormModal
          title={modal.mode === 'add' ? 'Nouveau bâtiment' : 'Modifier le bâtiment'}
          onClose={() => setModal(null)}
        >
          <BuildingForm
            defaultValues={modal.data || {}}
            onSubmit={handleSaveBuilding}
          />
        </FormModal>
      )}

      {modal?.type === 'room' && (
        <FormModal
          title={modal.mode === 'add' ? 'Nouvelle salle' : 'Modifier la salle'}
          onClose={() => setModal(null)}
        >
          <RoomForm
            defaultValues={modal.data || {}}
            onSubmit={handleSaveRoom}
          />
        </FormModal>
      )}

      {/* Modal suppression */}
      {deleteModal && (
        <DeleteModal
          message={deleteModal.message}
          onConfirm={deleteModal.onConfirm}
          onClose={() => setDeleteModal(null)}
        />
      )}

    </div>
  );
}
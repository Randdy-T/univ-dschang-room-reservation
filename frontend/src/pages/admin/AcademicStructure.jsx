import { useState } from 'react';
import {
  GraduationCap, Plus, Pencil, Trash2,
  ChevronDown, ChevronRight, BookOpen,
  Users, X, CheckCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ─── Données de simulation ────────────────────────────────────────────────────
// Respecte la hiérarchie du diagramme Academic Service :
// Faculty → Department → Program → Level

const initialFaculties = [
  {
    id: 1,
    code: 'FST',
    name: 'Faculté des Sciences et Technologies',
    telephone: '+237 233 000 001',
    email: 'fst@univ-dschang.cm',
    deanId: 4,
    departments: [
      {
        id: 1,
        code: 'INFO',
        name: 'Informatique',
        description: 'Département des sciences informatiques',
        facultyId: 1,
        programs: [
          {
            id: 1,
            code: 'LIC-INFO',
            name: 'Licence Informatique',
            description: 'Formation de base en informatique',
            dureeCycles: 3,
            departmentId: 1,
            levels: [
              { id: 1, code: 'L1-INFO', name: 'Licence 1 Informatique', capacity: 150, programId: 1 },
              { id: 2, code: 'L2-INFO', name: 'Licence 2 Informatique', capacity: 120, programId: 1 },
              { id: 3, code: 'L3-INFO', name: 'Licence 3 Informatique', capacity: 100, programId: 1 },
            ],
          },
          {
            id: 2,
            code: 'MST-INFO',
            name: 'Master Informatique',
            description: 'Formation avancée en informatique',
            dureeCycles: 2,
            departmentId: 1,
            levels: [
              { id: 4, code: 'M1-INFO', name: 'Master 1 Informatique', capacity: 60, programId: 2 },
              { id: 5, code: 'M2-INFO', name: 'Master 2 Informatique', capacity: 40, programId: 2 },
            ],
          },
        ],
      },
      {
        id: 2,
        code: 'MATH',
        name: 'Mathématiques',
        description: 'Département des sciences mathématiques',
        facultyId: 1,
        programs: [
          {
            id: 3,
            code: 'LIC-MATH',
            name: 'Licence Mathématiques',
            description: 'Formation de base en mathématiques',
            dureeCycles: 3,
            departmentId: 2,
            levels: [
              { id: 6, code: 'L1-MATH', name: 'Licence 1 Mathématiques', capacity: 130, programId: 3 },
              { id: 7, code: 'L2-MATH', name: 'Licence 2 Mathématiques', capacity: 110, programId: 3 },
              { id: 8, code: 'L3-MATH', name: 'Licence 3 Mathématiques', capacity: 90, programId: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    code: 'FSJP',
    name: 'Faculté des Sciences Juridiques et Politiques',
    telephone: '+237 233 000 002',
    email: 'fsjp@univ-dschang.cm',
    deanId: null,
    departments: [
      {
        id: 3,
        code: 'DROIT',
        name: 'Droit Privé',
        description: 'Département de droit privé',
        facultyId: 2,
        programs: [
          {
            id: 4,
            code: 'LIC-DROIT',
            name: 'Licence Droit',
            description: 'Formation de base en droit',
            dureeCycles: 3,
            departmentId: 3,
            levels: [
              { id: 9, code: 'L1-DROIT', name: 'Licence 1 Droit', capacity: 200, programId: 4 },
              { id: 10, code: 'L2-DROIT', name: 'Licence 2 Droit', capacity: 180, programId: 4 },
            ],
          },
        ],
      },
    ],
  },
];

// ─── Schemas ──────────────────────────────────────────────────────────────────

const facultySchema = z.object({
  code: z.string().min(2, 'Code requis'),
  name: z.string().min(3, 'Nom requis'),
  telephone: z.string().min(9, 'Téléphone requis'),
  email: z.string().email('Email invalide'),
});

const departmentSchema = z.object({
  code: z.string().min(2, 'Code requis'),
  name: z.string().min(2, 'Nom requis'),
  description: z.string().min(2, 'Description requise'),
});

const programSchema = z.object({
  code: z.string().min(2, 'Code requis'),
  name: z.string().min(2, 'Nom requis'),
  description: z.string().min(2, 'Description requise'),
  dureeCycles: z.string().min(1, 'Durée requise'),
});

const levelSchema = z.object({
  code: z.string().min(2, 'Code requis'),
  name: z.string().min(2, 'Nom requis'),
  capacity: z.string().min(1, 'Capacité requise'),
});

// ─── Sous-composants ──────────────────────────────────────────────────────────

function FormModal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-bold text-uds-blue text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-uds-gray text-uds-gray-dark">
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
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-uds-gray transition-all">
            Annuler
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function AcademicStructure() {
  const [faculties, setFaculties] = useState(initialFaculties);
  const [expandedFaculty, setExpandedFaculty] = useState(1);
  const [expandedDept, setExpandedDept] = useState(null);
  const [expandedProgram, setExpandedProgram] = useState(null);
  const [modal, setModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // ── Formulaires ────────────────────────────────────────────────────────────

  const GenericForm = ({ schema, fields, defaultValues, onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: zodResolver(schema),
      defaultValues,
    });
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                {...register(field.name)}
                className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm"
              >
                <option value="">-- Sélectionner --</option>
                {field.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : (
              <input
                {...register(field.name)}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-uds-gray outline-none focus:border-uds-blue focus:bg-white transition-all text-sm"
              />
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
            )}
          </div>
        ))}
        <button type="submit" className="w-full py-3 rounded-xl bg-uds-orange text-white font-bold text-sm hover:bg-uds-orange-light transition-all shadow-md mt-2">
          Enregistrer
        </button>
      </form>
    );
  };

  // ── Handlers Faculté ───────────────────────────────────────────────────────

  const handleSaveFaculty = (data) => {
    if (modal.mode === 'add') {
      setFaculties((prev) => [...prev, { id: Date.now(), ...data, deanId: null, departments: [] }]);
      showToast('Faculté ajoutée avec succès.');
    } else {
      setFaculties((prev) => prev.map((f) => f.id === modal.data.id ? { ...f, ...data } : f));
      showToast('Faculté modifiée avec succès.');
    }
    setModal(null);
  };

  const handleDeleteFaculty = (id) => {
    setFaculties((prev) => prev.filter((f) => f.id !== id));
    showToast('Faculté supprimée.');
    setDeleteModal(null);
  };

  // ── Handlers Département ───────────────────────────────────────────────────

  const handleSaveDept = (data) => {
    if (modal.mode === 'add') {
      const newDept = { id: Date.now(), ...data, facultyId: modal.facultyId, programs: [] };
      setFaculties((prev) => prev.map((f) =>
        f.id === modal.facultyId ? { ...f, departments: [...f.departments, newDept] } : f
      ));
      showToast('Département ajouté avec succès.');
    } else {
      setFaculties((prev) => prev.map((f) => ({
        ...f,
        departments: f.departments.map((d) => d.id === modal.data.id ? { ...d, ...data } : d),
      })));
      showToast('Département modifié avec succès.');
    }
    setModal(null);
  };

  const handleDeleteDept = (facultyId, deptId) => {
    setFaculties((prev) => prev.map((f) =>
      f.id === facultyId ? { ...f, departments: f.departments.filter((d) => d.id !== deptId) } : f
    ));
    showToast('Département supprimé.');
    setDeleteModal(null);
  };

  // ── Handlers Programme ─────────────────────────────────────────────────────

  const handleSaveProgram = (data) => {
    if (modal.mode === 'add') {
      const newProgram = {
        id: Date.now(), ...data,
        dureeCycles: parseInt(data.dureeCycles),
        departmentId: modal.deptId, levels: [],
      };
      setFaculties((prev) => prev.map((f) => ({
        ...f,
        departments: f.departments.map((d) =>
          d.id === modal.deptId ? { ...d, programs: [...d.programs, newProgram] } : d
        ),
      })));
      showToast('Programme ajouté avec succès.');
    } else {
      setFaculties((prev) => prev.map((f) => ({
        ...f,
        departments: f.departments.map((d) => ({
          ...d,
          programs: d.programs.map((p) =>
            p.id === modal.data.id ? { ...p, ...data, dureeCycles: parseInt(data.dureeCycles) } : p
          ),
        })),
      })));
      showToast('Programme modifié avec succès.');
    }
    setModal(null);
  };

  const handleDeleteProgram = (deptId, programId) => {
    setFaculties((prev) => prev.map((f) => ({
      ...f,
      departments: f.departments.map((d) =>
        d.id === deptId ? { ...d, programs: d.programs.filter((p) => p.id !== programId) } : d
      ),
    })));
    showToast('Programme supprimé.');
    setDeleteModal(null);
  };

  // ── Handlers Niveau ────────────────────────────────────────────────────────

  const handleSaveLevel = (data) => {
    if (modal.mode === 'add') {
      const newLevel = { id: Date.now(), ...data, capacity: parseInt(data.capacity), programId: modal.programId };
      setFaculties((prev) => prev.map((f) => ({
        ...f,
        departments: f.departments.map((d) => ({
          ...d,
          programs: d.programs.map((p) =>
            p.id === modal.programId ? { ...p, levels: [...p.levels, newLevel] } : p
          ),
        })),
      })));
      showToast('Niveau ajouté avec succès.');
    } else {
      setFaculties((prev) => prev.map((f) => ({
        ...f,
        departments: f.departments.map((d) => ({
          ...d,
          programs: d.programs.map((p) => ({
            ...p,
            levels: p.levels.map((l) =>
              l.id === modal.data.id ? { ...l, ...data, capacity: parseInt(data.capacity) } : l
            ),
          })),
        })),
      })));
      showToast('Niveau modifié avec succès.');
    }
    setModal(null);
  };

  const handleDeleteLevel = (programId, levelId) => {
    setFaculties((prev) => prev.map((f) => ({
      ...f,
      departments: f.departments.map((d) => ({
        ...d,
        programs: d.programs.map((p) =>
          p.id === programId ? { ...p, levels: p.levels.filter((l) => l.id !== levelId) } : p
        ),
      })),
    })));
    showToast('Niveau supprimé.');
    setDeleteModal(null);
  };

  // ── Stats ──────────────────────────────────────────────────────────────────

  const totalDepts = faculties.reduce((a, f) => a + f.departments.length, 0);
  const totalPrograms = faculties.reduce((a, f) => a + f.departments.reduce((b, d) => b + d.programs.length, 0), 0);
  const totalLevels = faculties.reduce((a, f) => a + f.departments.reduce((b, d) => b + d.programs.reduce((c, p) => c + p.levels.length, 0), 0), 0);

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
          <h1 className="text-2xl font-bold text-uds-blue">Structure académique</h1>
          <p className="text-uds-gray-dark text-sm mt-1">
            Gérez la hiérarchie Facultés → Départements → Filières → Niveaux
          </p>
        </div>
        <button
          onClick={() => setModal({ type: 'faculty', mode: 'add' })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-uds-orange text-white font-semibold text-sm hover:bg-uds-orange-light transition-all shadow-md"
        >
          <Plus size={16} /> Nouvelle faculté
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Facultés', value: faculties.length, color: 'bg-uds-blue', icon: GraduationCap },
          { label: 'Départements', value: totalDepts, color: 'bg-uds-orange', icon: BookOpen },
          { label: 'Filières', value: totalPrograms, color: 'bg-purple-500', icon: BookOpen },
          { label: 'Niveaux', value: totalLevels, color: 'bg-green-500', icon: Users },
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

      {/* Arborescence */}
      <div className="space-y-4">
        {faculties.map((faculty) => (
          <div key={faculty.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Faculté */}
            <div
              className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-uds-gray transition-colors"
              onClick={() => setExpandedFaculty(expandedFaculty === faculty.id ? null : faculty.id)}
            >
              <div className="flex items-center gap-3">
                {expandedFaculty === faculty.id
                  ? <ChevronDown size={20} className="text-uds-blue" />
                  : <ChevronRight size={20} className="text-uds-gray-dark" />
                }
                <div className="w-10 h-10 bg-uds-blue rounded-xl flex items-center justify-center shrink-0">
                  <GraduationCap size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-uds-blue">{faculty.name}</p>
                  <p className="text-xs text-uds-gray-dark">
                    {faculty.code} · {faculty.email} · {faculty.departments.length} département(s)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setModal({ type: 'dept', mode: 'add', facultyId: faculty.id })}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-uds-blue/10 text-uds-blue text-xs font-bold hover:bg-uds-blue hover:text-white transition-all"
                >
                  <Plus size={12} /> Département
                </button>
                <button
                  onClick={() => setModal({ type: 'faculty', mode: 'edit', data: faculty })}
                  className="p-2 rounded-lg hover:bg-uds-gray text-uds-gray-dark hover:text-uds-blue transition-all"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteModal({ message: `Supprimer la faculté "${faculty.name}" et tout son contenu ?`, onConfirm: () => handleDeleteFaculty(faculty.id) })}
                  className="p-2 rounded-lg hover:bg-red-50 text-uds-gray-dark hover:text-red-500 transition-all"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Départements */}
            {expandedFaculty === faculty.id && (
              <div className="border-t border-gray-100">
                {faculty.departments.length === 0 ? (
                  <p className="px-8 py-6 text-center text-uds-gray-dark text-sm">
                    Aucun département — cliquez sur "+ Département" pour en ajouter un.
                  </p>
                ) : (
                  faculty.departments.map((dept) => (
                    <div key={dept.id} className="border-b border-gray-50 last:border-0">

                      {/* Département */}
                      <div
                        className="flex items-center justify-between px-8 py-3.5 cursor-pointer hover:bg-uds-gray/50 transition-colors"
                        onClick={() => setExpandedDept(expandedDept === dept.id ? null : dept.id)}
                      >
                        <div className="flex items-center gap-3">
                          {expandedDept === dept.id
                            ? <ChevronDown size={16} className="text-uds-blue" />
                            : <ChevronRight size={16} className="text-uds-gray-dark" />
                          }
                          <div className="w-8 h-8 bg-uds-orange/10 rounded-lg flex items-center justify-center">
                            <BookOpen size={15} className="text-uds-orange" />
                          </div>
                          <div>
                            <p className="font-semibold text-uds-blue text-sm">{dept.name}</p>
                            <p className="text-xs text-uds-gray-dark">
                              {dept.code} · {dept.programs.length} filière(s)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setModal({ type: 'program', mode: 'add', deptId: dept.id })}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-uds-orange/10 text-uds-orange text-xs font-bold hover:bg-uds-orange hover:text-white transition-all"
                          >
                            <Plus size={12} /> Filière
                          </button>
                          <button
                            onClick={() => setModal({ type: 'dept', mode: 'edit', data: dept, facultyId: faculty.id })}
                            className="p-1.5 rounded-lg hover:bg-uds-gray text-uds-gray-dark hover:text-uds-blue transition-all"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ message: `Supprimer le département "${dept.name}" ?`, onConfirm: () => handleDeleteDept(faculty.id, dept.id) })}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-uds-gray-dark hover:text-red-500 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Programmes */}
                      {expandedDept === dept.id && (
                        <div className="px-12 pb-3">
                          {dept.programs.length === 0 ? (
                            <p className="text-center text-uds-gray-dark text-sm py-4">
                              Aucune filière — cliquez sur "+ Filière" pour en ajouter une.
                            </p>
                          ) : (
                            dept.programs.map((program) => (
                              <div key={program.id} className="mb-3">

                                {/* Programme */}
                                <div
                                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-uds-gray cursor-pointer hover:bg-gray-200/50 transition-colors"
                                  onClick={() => setExpandedProgram(expandedProgram === program.id ? null : program.id)}
                                >
                                  <div className="flex items-center gap-3">
                                    {expandedProgram === program.id
                                      ? <ChevronDown size={14} className="text-uds-blue" />
                                      : <ChevronRight size={14} className="text-uds-gray-dark" />
                                    }
                                    <div>
                                      <p className="font-semibold text-uds-blue text-sm">{program.name}</p>
                                      <p className="text-xs text-uds-gray-dark">
                                        {program.code} · {program.dureeCycles} an(s) · {program.levels.length} niveau(x)
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={() => setModal({ type: 'level', mode: 'add', programId: program.id })}
                                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold hover:bg-purple-500 hover:text-white transition-all"
                                    >
                                      <Plus size={11} /> Niveau
                                    </button>
                                    <button
                                      onClick={() => setModal({ type: 'program', mode: 'edit', data: { ...program, dureeCycles: String(program.dureeCycles) }, deptId: dept.id })}
                                      className="p-1.5 rounded-lg hover:bg-white text-uds-gray-dark hover:text-uds-blue transition-all"
                                    >
                                      <Pencil size={13} />
                                    </button>
                                    <button
                                      onClick={() => setDeleteModal({ message: `Supprimer la filière "${program.name}" ?`, onConfirm: () => handleDeleteProgram(dept.id, program.id) })}
                                      className="p-1.5 rounded-lg hover:bg-white text-uds-gray-dark hover:text-red-500 transition-all"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>

                                {/* Niveaux */}
                                {expandedProgram === program.id && (
                                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 px-2">
                                    {program.levels.length === 0 ? (
                                      <p className="text-center text-uds-gray-dark text-sm py-3 col-span-2">
                                        Aucun niveau — cliquez sur "+ Niveau".
                                      </p>
                                    ) : (
                                      program.levels.map((level) => (
                                        <div key={level.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between">
                                          <div>
                                            <p className="font-bold text-uds-blue text-sm">{level.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                              <span className="text-xs text-uds-gray-dark">{level.code}</span>
                                              <span className="flex items-center gap-1 text-xs text-uds-gray-dark">
                                                <Users size={11} /> {level.capacity} places
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex gap-1">
                                            <button
                                              onClick={() => setModal({ type: 'level', mode: 'edit', data: { ...level, capacity: String(level.capacity) }, programId: program.id })}
                                              className="p-1.5 rounded-lg hover:bg-uds-gray text-uds-gray-dark hover:text-uds-blue transition-all"
                                            >
                                              <Pencil size={13} />
                                            </button>
                                            <button
                                              onClick={() => setDeleteModal({ message: `Supprimer le niveau "${level.name}" ?`, onConfirm: () => handleDeleteLevel(program.id, level.id) })}
                                              className="p-1.5 rounded-lg hover:bg-uds-gray text-uds-gray-dark hover:text-red-500 transition-all"
                                            >
                                              <Trash2 size={13} />
                                            </button>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            ))
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
      {modal?.type === 'faculty' && (
        <FormModal title={modal.mode === 'add' ? 'Nouvelle faculté' : 'Modifier la faculté'} onClose={() => setModal(null)}>
          <GenericForm
            schema={facultySchema}
            defaultValues={modal.data || {}}
            onSubmit={handleSaveFaculty}
            fields={[
              { name: 'code', label: 'Code', placeholder: 'ex: FST' },
              { name: 'name', label: 'Nom', placeholder: 'ex: Faculté des Sciences' },
              { name: 'telephone', label: 'Téléphone', placeholder: 'ex: +237 233 000 000' },
              { name: 'email', label: 'Email', placeholder: 'ex: fst@univ-dschang.cm' },
            ]}
          />
        </FormModal>
      )}

      {modal?.type === 'dept' && (
        <FormModal title={modal.mode === 'add' ? 'Nouveau département' : 'Modifier le département'} onClose={() => setModal(null)}>
          <GenericForm
            schema={departmentSchema}
            defaultValues={modal.data || {}}
            onSubmit={handleSaveDept}
            fields={[
              { name: 'code', label: 'Code', placeholder: 'ex: INFO' },
              { name: 'name', label: 'Nom', placeholder: 'ex: Informatique' },
              { name: 'description', label: 'Description', placeholder: 'ex: Département des sciences informatiques' },
            ]}
          />
        </FormModal>
      )}

      {modal?.type === 'program' && (
        <FormModal title={modal.mode === 'add' ? 'Nouvelle filière' : 'Modifier la filière'} onClose={() => setModal(null)}>
          <GenericForm
            schema={programSchema}
            defaultValues={modal.data || {}}
            onSubmit={handleSaveProgram}
            fields={[
              { name: 'code', label: 'Code', placeholder: 'ex: LIC-INFO' },
              { name: 'name', label: 'Nom', placeholder: 'ex: Licence Informatique' },
              { name: 'description', label: 'Description', placeholder: 'ex: Formation de base en informatique' },
              { name: 'dureeCycles', label: 'Durée (années)', placeholder: 'ex: 3', type: 'number' },
            ]}
          />
        </FormModal>
      )}

      {modal?.type === 'level' && (
        <FormModal title={modal.mode === 'add' ? 'Nouveau niveau' : 'Modifier le niveau'} onClose={() => setModal(null)}>
          <GenericForm
            schema={levelSchema}
            defaultValues={modal.data || {}}
            onSubmit={handleSaveLevel}
            fields={[
              { name: 'code', label: 'Code', placeholder: 'ex: L1-INFO' },
              { name: 'name', label: 'Nom', placeholder: 'ex: Licence 1 Informatique' },
              { name: 'capacity', label: 'Capacité (étudiants)', placeholder: 'ex: 150', type: 'number' },
            ]}
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
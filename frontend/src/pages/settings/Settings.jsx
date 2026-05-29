import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User, Lock, Shield, Eye, EyeOff,
  CheckCircle, ArrowLeft, Loader2,
  Bell, Smartphone, Mail, X, Save, Download
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  nom: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(9, 'Téléphone requis'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(4, 'Mot de passe actuel requis'),
  newPassword: z.string().min(6, 'Minimum 6 caractères'),
  confirmPassword: z.string().min(6, 'Confirmez le mot de passe'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

const ROLE_LABELS = {
  ADMIN: 'Administrateur',
  TEACHER: 'Enseignant',
  ETUDIANT: 'Étudiant',
  HEAD_OF_DEPT: 'Chef de Département / Doyen',
};

const ROLE_COLORS = {
  ADMIN: 'bg-red-500',
  TEACHER: 'bg-uds-blue',
  ETUDIANT: 'bg-purple-500',
  HEAD_OF_DEPT: 'bg-uds-orange',
};

const TABS = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'password', label: 'Mot de passe', icon: Lock },
  { id: 'security', label: 'Sécurité (2FA)', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'export', label: 'Export PDF', icon: Download },
];

// ─── Données mock pour export ─────────────────────────────────────────────────

const mockTeacherReservations = [
  { room: 'Amphi 1000', level: 'Master 1 Info', date: '2026-05-24', from: '08:00', to: '10:00', type: 'Cours', status: 'Confirmée' },
  { room: 'Salle 204', level: 'Licence 3 Math', date: '2026-05-25', from: '10:00', to: '12:00', type: 'Cours', status: 'En attente' },
  { room: 'Labo Info 1', level: 'Master 2 Réseaux', date: '2026-05-26', from: '14:00', to: '16:00', type: 'Examen', status: 'Confirmée' },
  { room: 'Amphi 500', level: 'Licence 2 Info', date: '2026-05-27', from: '08:00', to: '10:00', type: 'Cours', status: 'Confirmée' },
];

const mockStudentSchedule = [
  { day: 'Lundi', course: 'Algorithmique Avancée', teacher: 'Dr. Tagne', room: 'Amphi 1000', from: '08:00', to: '10:00', type: 'Cours' },
  { day: 'Lundi', course: 'Réseaux Info', teacher: 'Pr. Mbarga', room: 'Labo Info 1', from: '14:00', to: '16:00', type: 'Cours' },
  { day: 'Mardi', course: 'Base de Données', teacher: 'Dr. Nguetsop', room: 'Salle 204', from: '10:00', to: '12:00', type: 'Cours' },
  { day: 'Mercredi', course: 'Examen Algorithmique', teacher: 'Dr. Tagne', room: 'Amphi 1000', from: '14:00', to: '16:00', type: 'Examen' },
  { day: 'Jeudi', course: 'Intelligence Artificielle', teacher: 'Pr. Kamdem', room: 'Labo Info 2', from: '10:00', to: '12:00', type: 'Cours' },
  { day: 'Vendredi', course: 'Génie Logiciel', teacher: 'Dr. Nguetsop', room: 'Salle 305', from: '08:00', to: '10:00', type: 'Cours' },
];

const mockDeanPlanning = [
  { day: 'Lundi', room: 'Amphi 1000', teacher: 'Dr. Tagne', level: 'Master 1 Info', from: '08:00', to: '10:00', type: 'Cours', status: 'Confirmée' },
  { day: 'Mardi', room: 'Salle 204', teacher: 'Dr. Nguetsop', level: 'Licence 3 Info', from: '10:00', to: '12:00', type: 'Examen', status: 'Confirmée' },
  { day: 'Mercredi', room: 'Amphi 1000', teacher: 'Pr. Kamdem', level: 'Master 1 Info', from: '14:00', to: '16:00', type: 'Examen', status: 'Confirmée' },
  { day: 'Jeudi', room: 'Labo Info 2', teacher: 'Dr. Nguetsop', level: 'Licence 1 Info', from: '10:00', to: '12:00', type: 'Cours', status: 'Confirmée' },
  { day: 'Vendredi', room: 'Salle 305', teacher: 'Dr. Tagne', level: 'Licence 3 Info', from: '08:00', to: '10:00', type: 'Examen', status: 'En attente' },
];

const mockAdminReservations = [
  { room: 'Amphi 1000', user: 'Dr. Tagne', level: 'Master 1 Info', date: '2026-05-24', from: '08:00', to: '10:00', type: 'Cours', status: 'Confirmée' },
  { room: 'Salle 204', user: 'Dr. Nguetsop', level: 'Licence 3 Math', date: '2026-05-24', from: '10:00', to: '12:00', type: 'Cours', status: 'En attente' },
  { room: 'Labo Info 1', user: 'Pr. Kamdem', level: 'Master 2 Réseaux', date: '2026-05-25', from: '14:00', to: '16:00', type: 'Examen', status: 'Confirmée' },
  { room: 'Amphi 500', user: 'Dr. Tagne', level: 'Licence 2 Info', date: '2026-05-25', from: '08:00', to: '10:00', type: 'Cours', status: 'En attente' },
];

// ─── Composant principal ──────────────────────────────────────────────────────

export default function Settings() {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState(null);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFAMethod, setTwoFAMethod] = useState('SMS');
  const [twoFAModal, setTwoFAModal] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAVerifying, setTwoFAVerifying] = useState(false);
  const [twoFAVerified, setTwoFAVerified] = useState(false);

  // Notifications state
  const [notifSettings, setNotifSettings] = useState({
    emailReservation: true,
    smsReservation: true,
    emailAnnulation: true,
    smsAnnulation: false,
    emailRappel: true,
    smsRappel: true,
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Formulaire profil ──────────────────────────────────────────────────────

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nom: user?.nom || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const onProfileSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 800));
    login({ ...user, ...data }, useAuthStore.getState().token);
    showToast('Profil mis à jour avec succès.');
  };

  // ── Formulaire mot de passe ────────────────────────────────────────────────

  const {
    register: registerPwd,
    handleSubmit: handlePwdSubmit,
    formState: { errors: pwdErrors, isSubmitting: pwdSubmitting },
    reset: resetPwd,
  } = useForm({ resolver: zodResolver(passwordSchema) });

  const onPasswordSubmit = async () => {
    await new Promise(r => setTimeout(r, 800));
    resetPwd();
    showToast('Mot de passe modifié avec succès.');
  };

  // ── 2FA ───────────────────────────────────────────────────────────────────

  const handle2FAToggle = () => {
    if (twoFAEnabled) {
      setTwoFAEnabled(false);
      setTwoFAVerified(false);
      showToast('Authentification 2FA désactivée.', 'error');
    } else {
      setTwoFAModal(true);
    }
  };

  const handle2FAVerify = () => {
    setTwoFAVerifying(true);
    setTimeout(() => {
      if (twoFACode === '123456') {
        setTwoFAEnabled(true);
        setTwoFAVerified(true);
        setTwoFAModal(false);
        setTwoFACode('');
        showToast('Authentification 2FA activée avec succès.');
      } else {
        showToast('Code invalide. Essayez 123456 (simulation).', 'error');
      }
      setTwoFAVerifying(false);
    }, 1000);
  };

  // ── Notifications ─────────────────────────────────────────────────────────

  const handleNotifChange = (key) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
    showToast('Préférences de notifications mises à jour.');
  };

  const getInitials = (nom) => {
    if (!nom) return 'U';
    return nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // ── Helpers PDF ────────────────────────────────────────────────────────────

  const addPDFHeader = (doc, title, subtitle) => {
    doc.setFillColor(30, 58, 95);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Université de Dschang', 14, 13);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Système de Réservation des Salles', 14, 21);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, 30);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 130, 30);
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(subtitle, 14, 43);
  };

  const addPDFFooter = (doc) => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(30, 58, 95);
      doc.rect(0, 285, 210, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text('© 2025 Université de Dschang — Direction des Affaires Académiques', 14, 293);
      doc.text(`Page ${i} / ${pageCount}`, 185, 293);
    }
  };

  const generateTeacherPDF = () => {
    const doc = new jsPDF();
    addPDFHeader(doc, 'Mes Réservations', `Enseignant : ${user?.nom || 'Enseignant'}`);
    autoTable(doc, {
      startY: 50,
      head: [['Salle', 'Niveau', 'Date', 'Créneau', 'Type', 'Statut']],
      body: mockTeacherReservations.map(r => [r.room, r.level, r.date, `${r.from} – ${r.to}`, r.type, r.status]),
      headStyles: { fillColor: [30, 58, 95], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [244, 246, 249] },
      styles: { overflow: 'linebreak' },
    });
    addPDFFooter(doc);
    doc.save(`reservations_${(user?.nom || 'enseignant').replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    showToast('PDF téléchargé avec succès.');
  };

  const generateStudentPDF = () => {
    const doc = new jsPDF();
    addPDFHeader(doc, 'Mon Emploi du Temps', `Étudiant : ${user?.nom || 'Étudiant'} — Master 1 Informatique`);
    autoTable(doc, {
      startY: 50,
      head: [['Jour', 'Cours', 'Enseignant', 'Salle', 'Créneau', 'Type']],
      body: mockStudentSchedule.map(r => [r.day, r.course, r.teacher, r.room, `${r.from} – ${r.to}`, r.type]),
      headStyles: { fillColor: [30, 58, 95], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [244, 246, 249] },
      styles: { overflow: 'linebreak' },
    });
    addPDFFooter(doc);
    doc.save(`emploi_du_temps_${(user?.nom || 'etudiant').replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    showToast('PDF téléchargé avec succès.');
  };

  const generateDeanPDF = () => {
    const doc = new jsPDF();
    addPDFHeader(doc, 'Planning du Département', `Chef de département : ${user?.nom || 'Chef dept'} — Département Informatique`);
    autoTable(doc, {
      startY: 50,
      head: [['Jour', 'Salle', 'Enseignant', 'Niveau', 'Créneau', 'Type', 'Statut']],
      body: mockDeanPlanning.map(r => [r.day, r.room, r.teacher, r.level, `${r.from} – ${r.to}`, r.type, r.status]),
      headStyles: { fillColor: [30, 58, 95], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [244, 246, 249] },
      styles: { overflow: 'linebreak' },
    });
    addPDFFooter(doc);
    doc.save(`planning_departement_${new Date().toISOString().split('T')[0]}.pdf`);
    showToast('PDF téléchargé avec succès.');
  };

  const generateAdminPDF = () => {
    const doc = new jsPDF();
    addPDFHeader(doc, 'Rapport des Réservations', `Administrateur : ${user?.nom || 'Admin'} — Vue globale`);
    autoTable(doc, {
      startY: 50,
      head: [['Salle', 'Enseignant', 'Niveau', 'Date', 'Créneau', 'Type', 'Statut']],
      body: mockAdminReservations.map(r => [r.room, r.user, r.level, r.date, `${r.from} – ${r.to}`, r.type, r.status]),
      headStyles: { fillColor: [30, 58, 95], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [244, 246, 249] },
      styles: { overflow: 'linebreak' },
    });
    addPDFFooter(doc);
    doc.save(`rapport_reservations_${new Date().toISOString().split('T')[0]}.pdf`);
    showToast('PDF téléchargé avec succès.');
  };

  const getExportConfig = () => {
    switch (user?.role) {
      case 'TEACHER':
        return {
          title: 'Mes Réservations',
          description: 'Téléchargez la liste de toutes vos réservations de salles au format PDF.',
          buttonLabel: 'Télécharger mes réservations',
          onExport: generateTeacherPDF,
          preview: mockTeacherReservations,
          columns: ['Salle', 'Niveau', 'Date', 'Créneau', 'Type', 'Statut'],
          rows: (r) => [r.room, r.level, r.date, `${r.from} – ${r.to}`, r.type, r.status],
        };
      case 'ETUDIANT':
        return {
          title: 'Mon Emploi du Temps',
          description: 'Téléchargez votre emploi du temps hebdomadaire au format PDF.',
          buttonLabel: 'Télécharger mon emploi du temps',
          onExport: generateStudentPDF,
          preview: mockStudentSchedule,
          columns: ['Jour', 'Cours', 'Enseignant', 'Salle', 'Créneau', 'Type'],
          rows: (r) => [r.day, r.course, r.teacher, r.room, `${r.from} – ${r.to}`, r.type],
        };
      case 'HEAD_OF_DEPT':
        return {
          title: 'Planning du Département',
          description: 'Téléchargez le planning complet du département au format PDF.',
          buttonLabel: 'Télécharger le planning',
          onExport: generateDeanPDF,
          preview: mockDeanPlanning,
          columns: ['Jour', 'Salle', 'Enseignant', 'Niveau', 'Créneau', 'Type', 'Statut'],
          rows: (r) => [r.day, r.room, r.teacher, r.level, `${r.from} – ${r.to}`, r.type, r.status],
        };
      case 'ADMIN':
        return {
          title: 'Rapport des Réservations',
          description: 'Téléchargez le rapport global de toutes les réservations au format PDF.',
          buttonLabel: 'Télécharger le rapport',
          onExport: generateAdminPDF,
          preview: mockAdminReservations,
          columns: ['Salle', 'Enseignant', 'Niveau', 'Date', 'Créneau', 'Type', 'Statut'],
          rows: (r) => [r.room, r.user, r.level, r.date, `${r.from} – ${r.to}`, r.type, r.status],
        };
      default:
        return null;
    }
  };

  const exportConfig = getExportConfig();

  // ── Rendu ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

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
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-white border border-gray-200 text-uds-gray-dark hover:text-uds-blue transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-uds-blue">Paramètres</h1>
          <p className="text-uds-gray-dark text-sm mt-0.5">
            Gérez vos informations personnelles et votre sécurité
          </p>
        </div>
      </div>

      {/* Carte profil */}
      <div className="bg-uds-blue rounded-2xl p-6 flex items-center gap-5">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 ${ROLE_COLORS[user?.role] || 'bg-uds-blue-light'}`}>
          {getInitials(user?.nom)}
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-lg">{user?.nom || 'Utilisateur'}</p>
          <p className="text-blue-200 text-sm">{user?.email || ''}</p>
          <span className="inline-block mt-1.5 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">
            {ROLE_LABELS[user?.role] || user?.role}
          </span>
        </div>
        {twoFAEnabled && (
          <div className="flex items-center gap-1.5 bg-green-500/20 text-green-300 text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
            <Shield size={13} /> 2FA Actif
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Onglets sidebar */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-semibold transition-all border-b border-gray-50 last:border-0 ${
                    activeTab === tab.id
                      ? 'bg-uds-blue text-white'
                      : 'text-uds-gray-dark hover:bg-uds-gray hover:text-uds-blue'
                  }`}
                >
                  <Icon size={17} />
                  {tab.label}
                  {tab.id === 'security' && twoFAEnabled && (
                    <span className="ml-auto w-2 h-2 bg-green-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1">

          {/* ── Onglet Profil ── */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-uds-blue text-lg mb-5 flex items-center gap-2">
                <User size={20} /> Informations personnelles
              </h2>
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nom complet</label>
                  <input
                    {...registerProfile('nom')}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-uds-gray outline-none transition-all text-sm ${
                      profileErrors.nom ? 'border-red-400' : 'border-transparent focus:border-uds-blue focus:bg-white'
                    }`}
                    placeholder="ex: Dr. Jean Tagne"
                  />
                  {profileErrors.nom && <p className="text-red-500 text-xs mt-1">{profileErrors.nom.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
                  <input
                    {...registerProfile('email')}
                    type="email"
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-uds-gray outline-none transition-all text-sm ${
                      profileErrors.email ? 'border-red-400' : 'border-transparent focus:border-uds-blue focus:bg-white'
                    }`}
                    placeholder="ex: nom@uds.cm"
                  />
                  {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Téléphone</label>
                  <input
                    {...registerProfile('phone')}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-uds-gray outline-none transition-all text-sm ${
                      profileErrors.phone ? 'border-red-400' : 'border-transparent focus:border-uds-blue focus:bg-white'
                    }`}
                    placeholder="ex: +237 699 000 000"
                  />
                  {profileErrors.phone && <p className="text-red-500 text-xs mt-1">{profileErrors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Rôle</label>
                  <div className="w-full px-4 py-3 rounded-xl bg-uds-gray text-sm text-uds-gray-dark font-medium cursor-not-allowed">
                    {ROLE_LABELS[user?.role] || user?.role}
                    <span className="ml-2 text-xs text-gray-400">(non modifiable)</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-uds-orange text-white font-bold text-sm hover:bg-uds-orange-light transition-all shadow-md disabled:opacity-60 mt-2"
                >
                  {profileSubmitting
                    ? <><Loader2 size={18} className="animate-spin" /> Enregistrement...</>
                    : <><Save size={18} /> Enregistrer les modifications</>
                  }
                </button>
              </form>
            </div>
          )}

          {/* ── Onglet Mot de passe ── */}
          {activeTab === 'password' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-uds-blue text-lg mb-5 flex items-center gap-2">
                <Lock size={20} /> Changer le mot de passe
              </h2>
              <form onSubmit={handlePwdSubmit(onPasswordSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Mot de passe actuel</label>
                  <div className="relative">
                    <input
                      {...registerPwd('currentPassword')}
                      type={showCurrentPwd ? 'text' : 'password'}
                      className={`w-full px-4 py-3 pr-12 rounded-xl border-2 bg-uds-gray outline-none transition-all text-sm ${
                        pwdErrors.currentPassword ? 'border-red-400' : 'border-transparent focus:border-uds-blue focus:bg-white'
                      }`}
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-uds-gray-dark hover:text-uds-blue">
                      {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {pwdErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.currentPassword.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      {...registerPwd('newPassword')}
                      type={showNewPwd ? 'text' : 'password'}
                      className={`w-full px-4 py-3 pr-12 rounded-xl border-2 bg-uds-gray outline-none transition-all text-sm ${
                        pwdErrors.newPassword ? 'border-red-400' : 'border-transparent focus:border-uds-blue focus:bg-white'
                      }`}
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-uds-gray-dark hover:text-uds-blue">
                      {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {pwdErrors.newPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.newPassword.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Confirmer le nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      {...registerPwd('confirmPassword')}
                      type={showConfirmPwd ? 'text' : 'password'}
                      className={`w-full px-4 py-3 pr-12 rounded-xl border-2 bg-uds-gray outline-none transition-all text-sm ${
                        pwdErrors.confirmPassword ? 'border-red-400' : 'border-transparent focus:border-uds-blue focus:bg-white'
                      }`}
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-uds-gray-dark hover:text-uds-blue">
                      {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {pwdErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.confirmPassword.message}</p>}
                </div>
                <div className="p-4 bg-uds-gray rounded-xl">
                  <p className="text-xs font-semibold text-uds-gray-dark mb-2">Exigences :</p>
                  <ul className="space-y-1 text-xs text-uds-gray-dark">
                    <li className="flex items-center gap-2"><CheckCircle size={12} className="text-green-500" /> Minimum 6 caractères</li>
                    <li className="flex items-center gap-2"><CheckCircle size={12} className="text-green-500" /> Différent de l'ancien mot de passe</li>
                  </ul>
                </div>
                <button
                  type="submit"
                  disabled={pwdSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-uds-blue text-white font-bold text-sm hover:bg-uds-blue-light transition-all shadow-md disabled:opacity-60"
                >
                  {pwdSubmitting
                    ? <><Loader2 size={18} className="animate-spin" /> Modification...</>
                    : <><Lock size={18} /> Modifier le mot de passe</>
                  }
                </button>
              </form>
            </div>
          )}

          {/* ── Onglet Sécurité 2FA ── */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-bold text-uds-blue text-lg flex items-center gap-2">
                <Shield size={20} /> Authentification à double facteur (2FA)
              </h2>
              <div className={`p-4 rounded-xl border-2 flex items-start gap-4 ${
                twoFAEnabled ? 'bg-green-50 border-green-200' : 'bg-uds-gray border-gray-100'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  twoFAEnabled ? 'bg-green-500' : 'bg-uds-gray-dark'
                }`}>
                  <Shield size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${twoFAEnabled ? 'text-green-700' : 'text-uds-blue'}`}>
                    {twoFAEnabled ? '✅ 2FA activée' : 'Authentification 2FA désactivée'}
                  </p>
                  <p className="text-xs text-uds-gray-dark mt-0.5">
                    {twoFAEnabled
                      ? `Protection active via ${twoFAMethod}. Votre compte est mieux sécurisé.`
                      : 'Activez la 2FA pour sécuriser davantage votre compte.'
                    }
                  </p>
                </div>
                <button
                  onClick={handle2FAToggle}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    twoFAEnabled
                      ? 'bg-red-100 text-red-600 hover:bg-red-500 hover:text-white'
                      : 'bg-uds-blue text-white hover:bg-uds-blue-light'
                  }`}
                >
                  {twoFAEnabled ? 'Désactiver' : 'Activer'}
                </button>
              </div>
              <div>
                <p className="text-sm font-bold text-uds-blue mb-3">Méthode de vérification</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'SMS', label: 'SMS', icon: Smartphone, desc: 'Code envoyé par SMS' },
                    { value: 'EMAIL', label: 'Email', icon: Mail, desc: 'Code envoyé par email' },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.value}
                        onClick={() => setTwoFAMethod(method.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          twoFAMethod === method.value
                            ? 'border-uds-blue bg-uds-blue/5'
                            : 'border-gray-100 hover:border-uds-blue/50'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${
                          twoFAMethod === method.value ? 'bg-uds-blue' : 'bg-uds-gray'
                        }`}>
                          <Icon size={18} className={twoFAMethod === method.value ? 'text-white' : 'text-uds-gray-dark'} />
                        </div>
                        <p className={`font-bold text-sm ${twoFAMethod === method.value ? 'text-uds-blue' : 'text-gray-700'}`}>
                          {method.label}
                        </p>
                        <p className="text-xs text-uds-gray-dark mt-0.5">{method.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="p-4 bg-uds-gray rounded-xl space-y-2">
                <p className="text-xs font-bold text-uds-blue">Comment fonctionne la 2FA ?</p>
                <div className="space-y-1.5 text-xs text-uds-gray-dark">
                  <p>1. Vous entrez votre email et mot de passe normalement</p>
                  <p>2. Un code à 6 chiffres vous est envoyé par {twoFAMethod === 'SMS' ? 'SMS' : 'email'}</p>
                  <p>3. Vous saisissez ce code pour accéder à votre compte</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Onglet Notifications ── */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-bold text-uds-blue text-lg flex items-center gap-2">
                <Bell size={20} /> Préférences de notifications
              </h2>
              {[
                {
                  category: 'Réservations',
                  items: [
                    { key: 'emailReservation', label: 'Confirmation de réservation', channel: 'Email', icon: Mail },
                    { key: 'smsReservation', label: 'Confirmation de réservation', channel: 'SMS', icon: Smartphone },
                  ]
                },
                {
                  category: 'Annulations',
                  items: [
                    { key: 'emailAnnulation', label: 'Annulation de cours / examen', channel: 'Email', icon: Mail },
                    { key: 'smsAnnulation', label: 'Annulation de cours / examen', channel: 'SMS', icon: Smartphone },
                  ]
                },
                {
                  category: 'Rappels',
                  items: [
                    { key: 'emailRappel', label: 'Rappel avant le cours', channel: 'Email', icon: Mail },
                    { key: 'smsRappel', label: 'Rappel avant le cours', channel: 'SMS', icon: Smartphone },
                  ]
                },
              ].map((section) => (
                <div key={section.category}>
                  <p className="text-xs font-bold text-uds-gray-dark uppercase tracking-wide mb-3">
                    {section.category}
                  </p>
                  <div className="space-y-2">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-uds-gray rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
                              <Icon size={15} className="text-uds-blue" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                              <p className="text-xs text-uds-gray-dark">via {item.channel}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleNotifChange(item.key)}
                            className={`relative w-12 h-6 rounded-full transition-all ${
                              notifSettings[item.key] ? 'bg-uds-blue' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                              notifSettings[item.key] ? 'left-7' : 'left-1'
                            }`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Onglet Export PDF ── */}
          {activeTab === 'export' && exportConfig && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h2 className="font-bold text-uds-blue text-lg flex items-center gap-2">
                <Download size={20} /> Export PDF
              </h2>

              {/* Infos */}
              <div className="flex items-start gap-4 p-4 bg-uds-gray rounded-xl">
                <div className="w-12 h-12 bg-uds-blue rounded-xl flex items-center justify-center shrink-0">
                  <Download size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-uds-blue">{exportConfig.title}</p>
                  <p className="text-sm text-uds-gray-dark mt-1">{exportConfig.description}</p>
                </div>
              </div>

              {/* Aperçu */}
              <div>
                <p className="text-xs font-bold text-uds-gray-dark uppercase tracking-wide mb-3">
                  Aperçu du contenu
                </p>
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-uds-blue">
                        {exportConfig.columns.map((col) => (
                          <th key={col} className="px-3 py-2.5 text-left text-white font-semibold whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {exportConfig.preview.slice(0, 4).map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-uds-gray/50'}>
                          {exportConfig.rows(row).map((cell, j) => (
                            <td key={j} className="px-3 py-2.5 text-gray-700 whitespace-nowrap">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {exportConfig.preview.length > 4 && (
                    <p className="text-xs text-center text-uds-gray-dark py-2 bg-uds-gray">
                      + {exportConfig.preview.length - 4} ligne(s) supplémentaire(s) dans le PDF
                    </p>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="p-4 bg-uds-gray rounded-xl">
                <p className="text-xs font-bold text-uds-blue mb-2">Informations incluses dans le PDF :</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-uds-gray-dark">
                  <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-500" /> En-tête UDS</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-500" /> Date de génération</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-500" /> Tableau formaté</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green-500" /> Pied de page officiel</span>
                </div>
              </div>

              {/* Bouton télécharger */}
              <button
                onClick={exportConfig.onExport}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-uds-orange text-white font-bold text-sm hover:bg-uds-orange-light transition-all shadow-md"
              >
                <Download size={18} /> {exportConfig.buttonLabel}
              </button>
            </div>
          )}

          {/* Onglet export sans config */}
          {activeTab === 'export' && !exportConfig && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-uds-blue font-bold">Export non disponible pour ce rôle.</p>
            </div>
          )}

        </div>
      </div>

      {/* Modal 2FA */}
      {twoFAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-14 h-14 bg-uds-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-white" />
            </div>
            <h3 className="text-uds-blue font-bold text-lg mb-2">Vérification 2FA</h3>
            <p className="text-uds-gray-dark text-sm mb-1">
              Un code de vérification a été envoyé via <span className="font-bold">{twoFAMethod}</span>
            </p>
            <p className="text-xs text-gray-400 mb-5">
              (Simulation : entrez <span className="font-bold text-uds-orange">123456</span>)
            </p>
            <input
              type="text"
              maxLength={6}
              value={twoFACode}
              onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full px-4 py-3 rounded-xl border-2 border-uds-blue bg-uds-gray outline-none text-center text-2xl font-bold tracking-widest text-uds-blue mb-5"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setTwoFAModal(false); setTwoFACode(''); }}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-uds-gray transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handle2FAVerify}
                disabled={twoFACode.length !== 6 || twoFAVerifying}
                className="flex-1 py-2.5 rounded-xl bg-uds-blue text-white font-bold text-sm hover:bg-uds-blue-light transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {twoFAVerifying
                  ? <><Loader2 size={16} className="animate-spin" /> Vérification...</>
                  : 'Vérifier'
                }
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
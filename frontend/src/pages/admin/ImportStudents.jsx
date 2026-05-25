import { useState, useRef } from 'react';
import {
  Upload, FileSpreadsheet, CheckCircle, XCircle,
  AlertCircle, Loader2, Download, Eye, Trash2,
  RefreshCw, Users, FileCheck, AlertTriangle
} from 'lucide-react';

// ─── Configs ──────────────────────────────────────────────────────────────────

// Respecte le diagramme StudentImportJob :
// id, fileName, importDate, totalRecords, successCount, failureCount, status
// méthodes : startImport(), validateFile(), processStudents()

const JOB_STATUS = {
  COMPLETED: { label: 'Terminé', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  PROCESSING: { label: 'En cours', color: 'bg-blue-100 text-blue-700', icon: Loader2 },
  FAILED: { label: 'Échoué', color: 'bg-red-100 text-red-600', icon: XCircle },
  VALIDATING: { label: 'Validation', color: 'bg-orange-100 text-uds-orange', icon: AlertCircle },
};

// Simulation historique des imports — vient du Academic Service
const mockImportHistory = [
  {
    id: 1,
    fileName: 'master1_info_2025.xlsx',
    importDate: '2026-05-20T09:30:00',
    totalRecords: 120,
    successCount: 118,
    failureCount: 2,
    status: 'COMPLETED',
  },
  {
    id: 2,
    fileName: 'licence3_math_2025.csv',
    importDate: '2026-05-18T14:15:00',
    totalRecords: 85,
    successCount: 85,
    failureCount: 0,
    status: 'COMPLETED',
  },
  {
    id: 3,
    fileName: 'master2_reseaux_2025.xlsx',
    importDate: '2026-05-15T11:00:00',
    totalRecords: 45,
    successCount: 40,
    failureCount: 5,
    status: 'FAILED',
  },
];

// Simulation erreurs d'un import
const mockErrors = [
  { row: 5, field: 'email', message: 'Format email invalide : "jean.kamgagmail.com"' },
  { row: 12, field: 'dateNaissance', message: 'Date invalide : "32/13/2001"' },
  { row: 23, field: 'matricule', message: 'Matricule déjà existant : "20E0056"' },
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function ImportStudents() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [importState, setImportState] = useState('idle');
  // idle | validating | processing | success | error
  const [progress, setProgress] = useState(0);
  const [currentJob, setCurrentJob] = useState(null);
  const [history, setHistory] = useState(mockImportHistory);
  const [showErrors, setShowErrors] = useState(false);
  const [selectedHistoryJob, setSelectedHistoryJob] = useState(null);
  const fileInputRef = useRef(null);

  // ── Gestion fichier ────────────────────────────────────────────────────────

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      alert('Format non supporté. Utilisez .xlsx, .xls ou .csv');
      return;
    }
    setFile(selectedFile);
    setImportState('idle');
    setCurrentJob(null);
    setProgress(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    handleFileSelect(dropped);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setImportState('idle');
    setCurrentJob(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Simulation import Spring Batch ────────────────────────────────────────
  // Simule : validateFile() → startImport() → processStudents()

  const handleImport = () => {
    if (!file) return;
    setImportState('validating');
    setProgress(0);

    // Étape 1 — validateFile()
    setTimeout(() => {
      setImportState('processing');
      setProgress(20);

      // Étape 2 — startImport() + processStudents()
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 15;
        });
      }, 400);

      // Étape 3 — Résultat final
      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);

        const newJob = {
          id: Date.now(),
          fileName: file.name,
          importDate: new Date().toISOString(),
          totalRecords: 120,
          successCount: 117,
          failureCount: 3,
          status: 'COMPLETED',
        };

        setCurrentJob(newJob);
        setHistory((prev) => [newJob, ...prev]);
        setImportState('success');
      }, 3000);
    }, 1500);
  };

  // ── Rendu ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-uds-blue">Import étudiants</h1>
          <p className="text-uds-gray-dark text-sm mt-1">
            Importez les listes d'étudiants via fichier Excel ou CSV 
          </p>
        </div>
        {/*<a 
          href="#"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-uds-blue text-uds-blue font-semibold text-sm hover:bg-uds-blue hover:text-white transition-all"
        >
          <Download size={16} /> Télécharger le modèle
        </a>*/}
      </div>

      {/* Info format */}
      <div className="bg-uds-blue/5 border border-uds-blue/20 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle size={18} className="text-uds-blue shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-uds-blue">Format attendu du fichier</p>
          <p className="text-xs text-uds-gray-dark mt-1">
            Colonnes requises : <span className="font-semibold">matricule, nom, prenom, email, dateNaissance, lieuNaissance, adresse, parentPhone, niveau, programme</span>
          </p>
          <p className="text-xs text-uds-gray-dark mt-0.5">
            Formats acceptés : <span className="font-semibold">.xlsx, .xls, .csv</span> — Taille max : 10 MB
          </p>
        </div>
      </div>

      {/* Zone d'upload */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-uds-blue text-lg mb-4 flex items-center gap-2">
          <Upload size={18} /> Sélectionner un fichier
        </h2>

        {!file ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-uds-orange bg-orange-50'
                : 'border-gray-200 hover:border-uds-blue hover:bg-uds-gray/50'
            }`}
          >
            <div className="w-16 h-16 bg-uds-gray rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileSpreadsheet size={32} className="text-uds-blue" />
            </div>
            <p className="text-uds-blue font-bold text-lg">
              Glissez votre fichier ici
            </p>
            <p className="text-uds-gray-dark text-sm mt-1">
              ou <span className="text-uds-orange font-semibold underline">parcourez vos fichiers</span>
            </p>
            <p className="text-gray-400 text-xs mt-3">.xlsx, .xls, .csv — max 10 MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Fichier sélectionné */}
            <div className="flex items-center gap-4 p-4 bg-uds-gray rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <FileSpreadsheet size={24} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-uds-blue text-sm truncate">{file.name}</p>
                <p className="text-xs text-uds-gray-dark mt-0.5">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              {importState === 'idle' && (
                <button
                  onClick={handleRemoveFile}
                  className="p-2 rounded-lg hover:bg-red-50 text-uds-gray-dark hover:text-red-500 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Progression */}
            {(importState === 'validating' || importState === 'processing') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="text-uds-blue animate-spin" />
                    <p className="text-sm font-semibold text-uds-blue">
                      {importState === 'validating' ? 'Validation du fichier...' : 'Traitement des étudiants...'}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-uds-orange">{progress}%</p>
                </div>
                <div className="h-2 bg-uds-gray rounded-full overflow-hidden">
                  <div
                    className="h-full bg-uds-blue rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-uds-gray-dark">
                  {importState === 'validating'
                    ? 'Vérification du format et des colonnes...'
                    : 'Insertion en base de données via Spring Batch...'
                  }
                </p>
              </div>
            )}

            {/* Résultat succès */}
            {importState === 'success' && currentJob && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle size={22} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-green-700">Import terminé avec succès</p>
                      <p className="text-xs text-green-600 mt-0.5">{formatDate(currentJob.importDate)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl p-3 text-center border border-green-100">
                      <p className="text-2xl font-bold text-uds-blue">{currentJob.totalRecords}</p>
                      <p className="text-xs text-uds-gray-dark mt-0.5">Total lignes</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-green-100">
                      <p className="text-2xl font-bold text-green-600">{currentJob.successCount}</p>
                      <p className="text-xs text-uds-gray-dark mt-0.5">Importés</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-green-100">
                      <p className="text-2xl font-bold text-red-500">{currentJob.failureCount}</p>
                      <p className="text-xs text-uds-gray-dark mt-0.5">Erreurs</p>
                    </div>
                  </div>
                  {currentJob.failureCount > 0 && (
                    <button
                      onClick={() => setShowErrors(!showErrors)}
                      className="flex items-center gap-2 mt-3 text-sm font-semibold text-uds-orange hover:underline"
                    >
                      <Eye size={14} />
                      {showErrors ? 'Masquer' : 'Voir'} les erreurs ({currentJob.failureCount})
                    </button>
                  )}
                </div>

                {/* Liste erreurs */}
                {showErrors && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2">
                    <p className="text-sm font-bold text-red-600 flex items-center gap-2">
                      <AlertTriangle size={16} /> Détail des erreurs
                    </p>
                    {mockErrors.map((err, i) => (
                      <div key={i} className="bg-white rounded-xl p-3 border border-red-100">
                        <div className="flex items-start gap-2">
                          <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full shrink-0">
                            Ligne {err.row}
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-red-600">Champ : {err.field}</p>
                            <p className="text-xs text-uds-gray-dark mt-0.5">{err.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Nouvel import */}
                <button
                  onClick={handleRemoveFile}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-uds-blue text-uds-blue font-semibold text-sm hover:bg-uds-blue hover:text-white transition-all"
                >
                  <RefreshCw size={16} /> Nouvel import
                </button>
              </div>
            )}

            {/* Bouton lancer import */}
            {importState === 'idle' && (
              <button
                onClick={handleImport}
                className="w-full py-3.5 rounded-xl bg-uds-orange text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-uds-orange-light transition-all shadow-md"
              >
                <Upload size={18} /> Lancer l'import
              </button>
            )}
          </div>
        )}
      </div>

      {/* Historique des imports */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-uds-blue text-lg flex items-center gap-2">
            <FileCheck size={18} /> Historique des imports
          </h2>
        </div>

        {history.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-uds-gray-dark font-medium">Aucun import effectué</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {history.map((job) => {
              const statusConf = JOB_STATUS[job.status];
              const StatusIcon = statusConf.icon;
              const successRate = Math.round((job.successCount / job.totalRecords) * 100);
              return (
                <div
                  key={job.id}
                  className="px-6 py-4 hover:bg-uds-gray transition-colors cursor-pointer"
                  onClick={() => setSelectedHistoryJob(selectedHistoryJob?.id === job.id ? null : job)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-uds-gray rounded-xl flex items-center justify-center shrink-0">
                        <FileSpreadsheet size={20} className="text-uds-blue" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-uds-blue text-sm truncate">{job.fileName}</p>
                        <p className="text-xs text-uds-gray-dark mt-0.5">{formatDate(job.importDate)}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-uds-gray-dark">
                            <Users size={11} /> {job.totalRecords} lignes
                          </span>
                          <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                            <CheckCircle size={11} /> {job.successCount}
                          </span>
                          {job.failureCount > 0 && (
                            <span className="flex items-center gap-1 text-xs text-red-500 font-semibold">
                              <XCircle size={11} /> {job.failureCount} erreurs
                            </span>
                          )}
                        </div>
                        {/* Barre de succès */}
                        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden w-40">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${successRate}%` }}
                          />
                        </div>
                        <p className="text-xs text-uds-gray-dark mt-0.5">{successRate}% de succès</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${statusConf.color}`}>
                      <StatusIcon size={11} />
                      {statusConf.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
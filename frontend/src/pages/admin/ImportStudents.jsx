import React, { useState } from 'react';

const ImportStudents = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const simulateUpload = () => {
    if (!file) return;
    setIsUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          alert("Importation réussie dans le Service Académique !");
          setFile(null);
          setProgress(0);
        }, 500);
      }
    }, 200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in zoom-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Importation Massive</h1>
          <p className="text-univ-green font-bold text-sm uppercase tracking-widest">Scolarité • Service Académique</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-2xl text-univ-blue font-bold text-xs">
          Formats acceptés: .CSV, .XLSX
        </div>
      </div>

      {/* ZONE DE DRAG & DROP */}
      <div className={`relative border-4 border-dashed rounded-[2.5rem] p-12 transition-all flex flex-col items-center justify-center bg-white ${
        file ? 'border-univ-green bg-green-50/30' : 'border-gray-200 hover:border-univ-blue hover:bg-blue-50/30'
      }`}>
        <input 
          type="file" 
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".csv, .xlsx"
        />
        
        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <span className="text-4xl">{file ? '📄' : '☁️'}</span>
        </div>

        {file ? (
          <div className="text-center">
            <p className="text-xl font-black text-gray-800">{file.name}</p>
            <p className="text-sm text-gray-500 font-medium">Prêt pour l'intégration Spring Batch</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl font-bold text-gray-800">Glissez votre liste d'étudiants ici</p>
            <p className="text-gray-400 font-medium">ou cliquez pour parcourir vos fichiers</p>
          </div>
        )}
      </div>

      {/* ZONE DE PRÉVISUALISATION (Glassmorphism) */}
      {file && !isUploading && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white">
          <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
            <span>🔍</span> Prévisualisation des données
          </h3>
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-400 font-black uppercase text-[10px]">
                <tr>
                  <th className="p-4">Matricule</th>
                  <th className="p-4">Nom Complet</th>
                  <th className="p-4">Filière</th>
                  <th className="p-4">Niveau</th>
                </tr>
              </thead>
              <tbody className="font-semibold text-gray-700">
                <tr className="border-t border-gray-50">
                  <td className="p-4">21U1234</td>
                  <td className="p-4">NGUELE Jean-Pierre</td>
                  <td className="p-4">Informatique</td>
                  <td className="p-4 text-univ-blue">Master 1</td>
                </tr>
                <tr className="border-t border-gray-50">
                  <td className="p-4">21U5678</td>
                  <td className="p-4">FOTSO Marie-Claire</td>
                  <td className="p-4">Informatique</td>
                  <td className="p-4 text-univ-blue">Master 1</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex gap-4">
            <button 
              onClick={simulateUpload}
              className="flex-1 py-4 bg-univ-blue text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-lg hover:shadow-blue-900/20 transition-all active:scale-95"
            >
              Lancer l'importation massive
            </button>
            <button 
              onClick={() => setFile(null)}
              className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* BARRE DE PROGRESSION (Simulation Spring Batch) */}
      {isUploading && (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center space-y-6">
          <div className="flex justify-between items-end mb-2">
            <p className="font-black text-univ-blue italic">Traitement par Spring Batch...</p>
            <p className="text-2xl font-black text-univ-blue">{progress}%</p>
          </div>
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-univ-blue transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm font-medium animate-pulse">
            Chiffrement des données sensibles (AES-256) en cours...
          </p>
        </div>
      )}
    </div>
  );
};

export default ImportStudents;
import React from 'react';

const TeacherHome = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Bienvenue, Cher Enseignant</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cartes statistiques rapides */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-univ-blue">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Mes Réservations</h3>
          <p className="text-3xl font-bold text-univ-blue">04</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-univ-green">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Prochain Cours</h3>
          <p className="text-lg font-bold text-gray-800">Amphi 1000 - 10h00</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4">Action Rapide</h2>
        <button className="bg-univ-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition shadow-md">
          + Effectuer une nouvelle réservation
        </button>
      </div>
    </div>
  );
};

export default TeacherHome;
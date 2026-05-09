import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const DashboardLayout = ({ role, menuItems }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-univ-blue text-white flex flex-col shadow-xl">
        <div className="p-6 text-center border-b border-blue-800">
          <h2 className="text-xl font-bold uppercase tracking-wider">Portail UD</h2>
          <span className="text-xs text-univ-green font-semibold">ESPACE {role}</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              to={item.path} 
              className="flex items-center p-3 rounded-lg hover:bg-white hover:text-univ-blue transition-all font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button 
            onClick={() => navigate('/')}
            className="w-full p-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* NAVBAR */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <div className="text-gray-600 font-medium">
            Système de Réservation des Salles - Univ-Dschang
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-univ-blue italic">Connecté : Dr. Tagne</span>
            <div className="w-10 h-10 bg-univ-blue rounded-full flex items-center justify-center text-white font-bold">
              T
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet /> {/* C'est ici que s'afficheront les pages spécifiques */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
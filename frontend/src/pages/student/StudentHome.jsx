import React from 'react';

const StudentHome = () => {
  // Données simulées (viendront du Service Réservation + Service Notification)
  const todayClasses = [
    { id: 1, time: "08:00 - 10:00", subject: "Algorithmique Avancée", room: "Amphi 1000", teacher: "Dr. Tagne", status: "Confirmé" },
    { id: 2, time: "10:30 - 12:30", subject: "Architecture Microservices", room: "Salle 12", teacher: "M. Fotso", status: "En cours" },
    { id: 3, time: "14:00 - 16:00", subject: "Sécurité Réseaux", room: "Labo Info 1", teacher: "Mme. Kenfack", status: "À venir" },
  ];

  const recentNotifications = [
    { id: 1, date: "Il y a 10 min", msg: "Votre cours de 14h est déplacé au Labo Info 2.", type: "SMS" },
    { id: 2, date: "Hier, 18h", msg: "Programmation : Examen de Rattrapage en Amphi 500.", type: "Email" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right duration-500">
      
      {/* HEADER ÉTUDIANT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Mon Emploi du Temps</h1>
          <p className="text-univ-green font-bold text-sm uppercase tracking-widest">Master 1 Informatique • Année 2024/2025</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
          <span className="text-xs font-black text-gray-600 uppercase">Direct Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : LE PLANNING DU JOUR */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-univ-blue flex items-center gap-2">
            <span>📅</span> Aujourd'hui, {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>

          <div className="space-y-4">
            {todayClasses.map((item) => (
              <div key={item.id} className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all border-l-8 border-univ-blue flex items-center justify-between group">
                <div className="space-y-1">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">{item.time}</p>
                  <h3 className="text-lg font-black text-gray-800 group-hover:text-univ-blue transition-colors">{item.subject}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <span className="p-1 bg-gray-100 rounded">📍</span> {item.room} • {item.teacher}
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                    item.status === "En cours" ? "bg-univ-green text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLONNE DROITE : NOTIFICATIONS & ALERTES */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>🔔</span> Alertes Récentes
          </h2>

          <div className="space-y-4">
            {recentNotifications.map((notif) => (
              <div key={notif.id} className="bg-univ-blue/5 border border-univ-blue/10 rounded-2xl p-4 space-y-2 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black bg-univ-blue text-white px-2 py-0.5 rounded uppercase">
                    {notif.type}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">{notif.date}</span>
                </div>
                <p className="text-sm font-semibold text-gray-700 leading-snug">
                  {notif.msg}
                </p>
                {/* Petit effet visuel de notification */}
                <div className="absolute -right-2 -bottom-2 opacity-10 text-4xl grayscale">🔔</div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-univ-blue p-6 rounded-[2rem] text-white shadow-xl">
             <h3 className="font-black text-lg mb-2">Besoin d'aide ?</h3>
             <p className="text-xs text-blue-100 opacity-70 mb-4">Contactez la scolarité pour toute erreur de programmation.</p>
             <button className="w-full py-3 bg-univ-green text-white rounded-xl text-xs font-black uppercase hover:scale-105 transition-transform">
               Ouvrir un ticket
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentHome;
import React, { useState } from 'react';

const SearchRooms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const rooms = [
    { id: 1, name: "Amphi 1000", campus: "Campus A", cap: 1000, amenities: ['wifi', 'projector', 'mic'], schedule: [8, 9, 12, 13, 14, 18] },
    { id: 2, name: "Salle de Conférence", campus: "Campus C", cap: 150, amenities: ['ac', 'projector'], schedule: [10, 11, 15, 16] },
    { id: 3, name: "Labo Recherche", campus: "Campus B", cap: 25, amenities: ['wifi', 'pc'], schedule: [8, 9, 10, 11, 12, 13] },
  ];

  return (
    <div className="flex gap-8 h-full animate-in slide-in-from-bottom-10 duration-700">
      
      {/* 1. SIDEBAR DE FILTRES AVANCÉS */}
      <aside className="w-80 bg-white rounded-3xl shadow-2xl p-6 hidden xl:block border border-gray-100 sticky top-0 h-fit">
        <h2 className="text-xl font-black text-univ-blue mb-6">Filtres Précis</h2>
        
        <div className="space-y-8">
          <div>
            <label className="text-xs font-black uppercase text-gray-400 mb-3 block">Capacité Minimale</label>
            <input type="range" min="10" max="1000" className="w-full accent-univ-blue" />
            <div className="flex justify-between text-xs font-bold text-gray-500 mt-2">
              <span>10 places</span>
              <span>1000+</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase text-gray-400 mb-3 block">Équipements Requis</label>
            <div className="grid grid-cols-2 gap-2">
              {['Vidéoproj', 'Wifi', 'Clim', 'Micro', 'Labo PC'].map(item => (
                <label key={item} className="flex items-center gap-2 p-2 rounded-xl border border-gray-100 hover:bg-blue-50 cursor-pointer transition-all">
                  <input type="checkbox" className="rounded text-univ-blue" />
                  <span className="text-xs font-semibold text-gray-600">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* 2. ZONE PRINCIPALE */}
      <div className="flex-1 space-y-8">
        
        {/* HEADER & SEARCH BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Espace Réservation</h1>
            <p className="text-univ-green font-bold text-sm">3 Campus • 124 Salles connectées</p>
          </div>
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Chercher une salle par nom..."
              className="pl-12 pr-6 py-4 bg-white border-none rounded-2xl shadow-lg w-full md:w-80 focus:ring-2 focus:ring-univ-blue transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* GRILLE DE RÉSULTATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col">
              
              {/* IMAGE / HEADER DE LA CARTE */}
              <div className="h-40 bg-gradient-to-br from-univ-blue to-blue-900 p-6 relative flex flex-col justify-end">
                <div className="absolute top-4 right-4 flex gap-2">
                   {room.amenities.map(a => (
                     <span key={a} className="bg-white/20 backdrop-blur-md p-2 rounded-lg text-white text-xs">
                        {a === 'wifi' && '📶'} {a === 'projector' && '📽️'} {a === 'ac' && '❄️'} {a === 'pc' && '💻'}
                     </span>
                   ))}
                </div>
                <h3 className="text-2xl font-bold text-white">{room.name}</h3>
                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">{room.campus}</p>
              </div>

              {/* DÉTAILS ET TIMELINE */}
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <span className="p-2 bg-gray-100 rounded-lg text-lg">👥</span>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Capacité</p>
                        <p className="text-sm font-black text-univ-blue">{room.cap} Personnes</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase">État actuel</p>
                      <p className="text-sm font-black text-univ-green">● Libre</p>
                   </div>
                </div>

                {/* LA TIMELINE (L'élément WOW) */}
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-3">Occupation aujourd'hui (8h - 18h)</p>
                  <div className="flex h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                    {[8,9,10,11,12,13,14,15,16,17,18].map(h => (
                      <div 
                        key={h}
                        className={`flex-1 border-r border-white/50 ${room.schedule.includes(h) ? 'bg-red-400' : 'bg-univ-green/40 hover:bg-univ-green transition-colors cursor-pointer'}`}
                        title={`${h}h:00`}
                      />
                    ))}
                  </div>
                </div>

                <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-univ-blue hover:-translate-y-1 transition-all shadow-xl shadow-blue-900/10 active:scale-95">
                  Réserver Immédiatement
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchRooms;
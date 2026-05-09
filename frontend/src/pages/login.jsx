import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation de l'appel GraphQL pour plus tard
    console.log("Tentative de connexion avec :", { email, password });
    
    setTimeout(() => {
      setIsLoading(false);
      alert("Connexion réussie (Simulation). Bienvenue sur le portail de l'Univ-Dschang !");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Carte de Connexion */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* En-tête avec les couleurs de l'Université */}
        <div className="bg-univ-blue p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-inner">
            {/* Emplacement Logo - On met un texte en attendant l'image */}
            <span className="text-univ-blue font-bold text-xs">LOGO UD</span>
          </div>
          <h1 className="text-white text-2xl font-bold uppercase tracking-wide">
            Université de Dschang
          </h1>
          <p className="text-blue-100 text-sm mt-1 opacity-80">
            Système de Réservation des Salles
          </p>
        </div>

        {/* Corps du Formulaire */}
        <div className="p-8">
          <h2 className="text-gray-800 text-xl font-semibold mb-6 text-center">
            Accédez à votre espace
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Champ Email / Matricule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email ou Matricule
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-univ-blue focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                placeholder="ex: p.nom@univ-dschang.cm"
              />
            </div>

            {/* Champ Mot de passe */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <a href="#" className="text-xs text-univ-green hover:underline font-semibold">
                  Oublié ?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-univ-blue focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                placeholder="••••••••"
              />
            </div>

            {/* Bouton de Connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-lg flex items-center justify-center ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-univ-blue hover:bg-opacity-90 active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "SE CONNECTER"
              )}
            </button>
          </form>

          {/* Pied de page de la carte */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Réservé aux Enseignants, Étudiants et Administration
            </p>
            <p className="text-[10px] text-gray-400 mt-2 uppercase">
              © 2025 Direction des Affaires Académiques
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
function App() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full border-t-8 border-univ-blue">
        <h1 className="text-2xl font-bold text-univ-blue text-center mb-4">
          Université de Dschang
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Si vous voyez ce texte avec un fond bleu clair et une carte blanche, alors 
          <span className="font-bold text-univ-green"> Tailwind est prêt !</span>
        </p>
        <button className="w-full py-3 bg-univ-blue text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-md">
          Démarrer le projet
        </button>
      </div>
    </div>
  )
}

export default App
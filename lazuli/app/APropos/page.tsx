"use client";

import Link from "next/link";

export default function AproposPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
          Lazuli
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Updated Logo */}
          <div className="w-32 h-32 mx-auto mb-6 animate-spin">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-full h-full text-blue-600"
              aria-label="Logo Crypto"
              role="img"
            >
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold mb-6 text-blue-800">À propos</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Bienvenue sur Lazuli, votre portail d'exploration et d'apprentissage dans l'univers fascinant des cryptomonnaies ! Notre mission est de vous offrir une plateforme innovante pour simuler des transactions en cryptomonnaies, sans risque financier. Que vous soyez un novice cherchant à comprendre les fondamentaux ou un investisseur aguerri souhaitant tester de nouvelles stratégies, Lazuli est conçu pour répondre à vos besoins. Grâce à notre environnement sécurisé et réaliste, vous pouvez expérimenter, analyser et affiner vos compétences en trading, tout en restant à l’abri des fluctuations du marché réel. Rejoignez-nous pour découvrir, apprendre et maîtriser le monde des cryptomonnaies avec confiance et expertise.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 px-6 py-4 text-center">
        <p className="text-sm text-gray-600">
          © 2024 Lazuli. Tous droits réservés. Ceci est une plateforme de simulation.
        </p>
        <nav className="mt-2">
          <Link href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors mx-2">
            Conditions d'utilisation
          </Link>
          <Link href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors mx-2">
            Politique de confidentialité
          </Link>
        </nav>
      </footer>

      <style jsx global>{`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-spin {
          animation: spin 10s linear infinite;
        }
      `}</style>
    </div>
  );
}

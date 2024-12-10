"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AproposPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="px-6 lg:px-8 h-16 flex items-center border-b border-gray-700 shadow-md">
        <Link href="/" className="text-2xl font-extrabold text-blue-300 hover:text-purple-400 transition-all">
          Lazuli
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium text-gray-300 hover:text-purple-200 transition-all" href="/APropos">
            À propos
          </Link>
          <Link className="text-sm font-medium text-gray-300 hover:text-purple-200 transition-all" href="/Aide">
            Aide
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-purple-700 to-blue-700 p-10 rounded-3xl shadow-2xl text-center transform transition-transform duration-300 hover:scale-105">
          {/* Logo */}
          <div className="w-32 h-32 mx-auto mb-8 animate-glow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-full h-full text-gradient"
              aria-label="Logo Crypto"
              role="img"
            >
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
              />
            </svg>
          </div>

          <h2 className="text-5xl font-extrabold mb-6 text-[#00FF91] text-shadow-xl animate-fadeInUp">
            À propos
          </h2>

          <p className="text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed animate-fadeInUp delay-100">
            Bienvenue sur Lazuli, votre portail d'exploration et d'apprentissage dans l'univers fascinant des cryptomonnaies !
            Notre mission est de vous offrir une plateforme innovante pour simuler des transactions en cryptomonnaies, sans risque financier.
            Que vous soyez un novice cherchant à comprendre les fondamentaux ou un investisseur aguerri souhaitant tester de nouvelles stratégies,
            Lazuli est conçu pour répondre à vos besoins. Grâce à notre environnement sécurisé et réaliste, vous pouvez expérimenter, analyser
            et affiner vos compétences en trading, tout en restant à l’abri des fluctuations du marché réel. Rejoignez-nous pour découvrir,
            apprendre et maîtriser le monde des cryptomonnaies avec confiance et expertise.
          </p>

          <Link href="/">
            <Button
              type="button"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-110 rounded-full transform transition-all duration-300 ease-in-out mt-8"
            >
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 border-t border-gray-700 text-center text-sm text-gray-400">
        <p className="mb-4">© 2024 Lazuli. Tous droits réservés. Ceci est une plateforme de simulation.</p>
        <nav className="space-x-6">
          <Link href="#" className="hover:text-[#00FF91] transition-all duration-300 ease-in-out transform hover:scale-110">
            Conditions d'utilisation
          </Link>
          <Link href="#" className="hover:text-[#00FF91] transition-all duration-300 ease-in-out transform hover:scale-110">
            Politique de confidentialité
          </Link>
        </nav>
      </footer>

      {/* Animations and Global Styles */}
      <style jsx global>{`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        /* Custom Animations */
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes glow {
          0% { text-shadow: 0 0 5px #00FF91, 0 0 10px #56CCF2, 0 0 15px #00FF91; }
          50% { text-shadow: 0 0 10px #00FF91, 0 0 20px #56CCF2, 0 0 25px #00FF91; }
          100% { text-shadow: 0 0 5px #00FF91, 0 0 10px #56CCF2, 0 0 15px #00FF91; }
        }

        @keyframes hoverBtn {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 1s ease-out;
        }

        .animate-glow {
          animation: glow 1.5s infinite alternate;
        }

        .animate-hoverBtn:hover {
          animation: hoverBtn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

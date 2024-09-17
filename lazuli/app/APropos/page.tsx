"use client";
import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function AproposPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-[#1a1a40] text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-black-700">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-xl slide-down ">Lazuli</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-3xl mx-auto text-center bg-white p-8 rounded-lg shadow-xl">
          {/* Updated Logo */}
          <div className="w-24 h-24 mx-auto mb-8 animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-full h-full text-blue-500"
              aria-label="Logo Crypto"
              role="img"
            >
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
              />
            </svg>
          </div>
          <h2 className="text-5xl font-extrabold mb-6 text-[#1a1a40]">À propos</h2>
          <p className="text-lg text-gray-800 max-w-4xl mx-auto leading-relaxed">
            Bienvenue sur Lazuli, votre portail d'exploration et d'apprentissage dans l'univers fascinant des cryptomonnaies ! Notre mission est de vous offrir une plateforme innovante pour simuler des transactions en cryptomonnaies, sans risque financier. Que vous soyez un novice cherchant à comprendre les fondamentaux ou un investisseur aguerri souhaitant tester de nouvelles stratégies, Lazuli est conçu pour répondre à vos besoins. Grâce à notre environnement sécurisé et réaliste, vous pouvez expérimenter, analyser et affiner vos compétences en trading, tout en restant à l’abri des fluctuations du marché réel. Rejoignez-nous pour découvrir, apprendre et maîtriser le monde des cryptomonnaies avec confiance et expertise.
          </p>
          <Link href="/">
          <Button type="submit" className="w-full bg-[#3b3b82] text-white hover:bg-[#4c4c96] rounded-full">
                Retour
              </Button>
          </Link>
        </div>
      
      </main>
          

      {/* Footer */}
      <footer className="bg-[#1a1a40] border-t border-gray-700 px-8 py-6 text-center">
        <p className="text-sm text-gray-300 mb-4">
          © 2024 Lazuli. Tous droits réservés. Ceci est une plateforme de simulation.
        </p>
        <nav className="space-x-4">
          <Link href="#" className="text-sm text-gray-300 hover:text-gray-100 transition-colors duration-300">
            Conditions d'utilisation
          </Link>
          <Link href="#" className="text-sm text-gray-300 hover:text-gray-100 transition-colors duration-300">
            Politique de confidentialité
          </Link>
        </nav>
      </footer>

      <style jsx global>{`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}

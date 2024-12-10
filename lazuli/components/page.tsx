'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import ChatIcon from "@/components/chatIcon";

export function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-700 shadow-md">
        <Link href="/" className="text-2xl font-extrabold text-blue-300 hover:text-purple-400 transition-all">
          Lazuli
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium text-gray-300 hover:text-purple-200 transition-all" href="/APropos">À propos</Link>
          <Link className="text-sm font-medium text-gray-300 hover:text-purple-200 transition-all" href="/Aide">Aide</Link>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-gradient-to-r from-purple-700 to-blue-700 p-8 rounded-xl shadow-xl text-center">
          <div className="flex justify-center mb-8 fade-in">
            {/* Planète en rotation */}
            <svg
              className="animate-spin-planet"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 500 500"
              width="300"
              height="300"
            >
              <defs>
                <radialGradient id="planetGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#00e5ff" />
                  <stop offset="100%" stopColor="#001f3f" />
                </radialGradient>
                <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="10" result="blurred" />
                  <feMerge>
                    <feMergeNode in="blurred" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#00e5ff" />
                </filter>
                <radialGradient id="starGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#cccccc" />
                </radialGradient>
                <radialGradient id="gemGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#005f8d" />
                  <stop offset="60%" stopColor="#003e5b" />
                  <stop offset="100%" stopColor="#001f3f" />
                </radialGradient>
              </defs>

              <circle
                cx="250"
                cy="250"
                r="180"
                fill="url(#planetGradient)"
                filter="url(#glowEffect)"
              />
              <ellipse
                cx="250"
                cy="290"
                rx="180"
                ry="50"
                fill="rgba(0, 0, 0, 0.5)"
                filter="url(#shadow)"
              />
              <circle
                cx="250"
                cy="220"
                r="50"
                fill="url(#gemGradient)"
                filter="url(#glowEffect)"
              />
              <ellipse
                cx="250"
                cy="280"
                rx="50"
                ry="20"
                fill="rgba(0, 0, 0, 0.5)"
                filter="url(#glowEffect)"
              />
              <g className="orbiting-stars">
                <circle cx="250" cy="50" r="5" fill="url(#starGradient)" opacity="0.8" />
                <circle cx="450" cy="250" r="5" fill="url(#starGradient)" opacity="0.8" />
                <circle cx="250" cy="450" r="5" fill="url(#starGradient)" opacity="0.8" />
                <circle cx="50" cy="250" r="5" fill="url(#starGradient)" opacity="0.8" />
              </g>
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold mb-2 slide-down">Bienvenue sur Lazuli</h1>
          <p className="text-2xl font-semibold mb-4 fade-in">Simulateur de Trading Crypto</p>
          <p className="text-lg text-gray-200 fade-in mb-8">
            Expérimentez le trading de crypto-monnaies sans risque avec notre plateforme de simulation. Perfectionnez vos stratégies sans utiliser de vraie monnaie.
          </p>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-full shadow-lg hover:scale-105 transition-transform mb-4 slide-down-form4">
              Démarrer la Simulation
            </Button>
          </Link>
          <br />
          <Link href="/SignUp">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-full shadow-lg hover:scale-105 transition-transform slide-down-form4">
              Devenir un membre
            </Button>
          </Link>
          <div className="mt-8 p-4 bg-blue-800 bg-opacity-60 rounded-lg slide-down-form5">
            <h2 className="text-lg font-semibold mb-2 text-white">Mode Simulation Actif</h2>
            <p className="text-sm text-gray-200">
              Tous les échanges et soldes sur cette plateforme sont simulés. Aucune crypto-monnaie réelle n'est utilisée ou mise en risque.
            </p>
          </div>
        </div>
      </main>
      <footer className="py-6 px-4 border-t border-gray-700 text-center text-sm text-gray-400">
        © 2024 Lazuli. Tous droits réservés. Ceci est une plateforme de simulation.
      </footer>
      <ChatIcon />

      <style jsx global>{`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        .fade-in {
          animation: fadeIn 1.5s ease-in-out;
        }
        .slide-down {
          animation: slideDown 1.5s ease-in-out;
        }
        .slide-down-form4 {
          animation: slideUp 2.4s ease-in-out;
        }
        .slide-down-form5 {
          animation: slideUp 2.6s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0.5; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes spin-planet {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-planet {
          animation: spin-planet 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

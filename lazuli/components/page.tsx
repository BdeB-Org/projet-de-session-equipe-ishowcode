'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import ChatIcon from "@/components/chatIcon"; 
import { useTheme } from "@/app/api/ThemeContext/route"; // Adjust path if needed

export function Page() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-[#1a1a40] text-gray-200' : 'bg-white text-black'}`}>
      <header className={`px-4 lg:px-6 h-14 flex items-center border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-400'}`}>
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl">Lazuli</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-gray-300" href="/APropos">À propos</Link>
          <Link className="text-sm font-medium hover:text-gray-300" href="/Aide">Aide</Link>
        </nav>
        <Button onClick={toggleTheme} className={`ml-4 ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-black'} text-sm p-2 rounded`}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-2xl mb-8">
          <div className="flex justify-center mb-8 animate-spin-planet">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 500 500"
              width="500"
              height="500"
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

              {/* Planet Shape */}
              <circle
                cx="250"
                cy="250"
                r="180"
                fill="url(#planetGradient)"
                filter="url(#glowEffect)"
              />

              {/* Shadow of the Planet */}
              <ellipse
                cx="250"
                cy="290"
                rx="180"
                ry="50"
                fill="rgba(0, 0, 0, 0.5)"
                filter="url(#shadow)"
              />

              {/* Lazuli Gem Stone */}
              <circle
                cx="250"
                cy="220"
                r="50"
                fill="url(#gemGradient)"
                filter="url(#glowEffect)"
              />

              {/* Shadow of the Stone */}
              <ellipse
                cx="250"
                cy="280"
                rx="50"
                ry="20"
                fill="rgba(0, 0, 0, 0.5)"
                filter="url(#glowEffect)"
              />

              {/* Static Stars */}
              <g className="orbiting-stars">
                <circle cx="250" cy="50" r="5" fill="url(#starGradient)" opacity="0.8" />
                <circle cx="450" cy="250" r="5" fill="url(#starGradient)" opacity="0.8" />
                <circle cx="250" cy="450" r="5" fill="url(#starGradient)" opacity="0.8" />
                <circle cx="50" cy="250" r="5" fill="url(#starGradient)" opacity="0.8" />
              </g>
            </svg>
          </div>
          <h1 className={`text-5xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'} `} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
            Bienvenue sur Lazuli
          </h1>
          <p className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-black'} fade-in`} style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)' }}>
            Simulateur de Trading Crypto
          </p>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} fade-in`}>
            Expérimentez le trading de crypto-monnaies sans risque avec notre plateforme de simulation. Perfectionnez vos stratégies sans utiliser de vraie monnaie.
          </p>
          <Link href="/login">
            <Button className="bg-[#3b3b82] text-white hover:bg-[#4c4c96] rounded-full mb-4 hover:scale-105 transition-transform duration-300 ease-in-out">
              Démarrer la Simulation
            </Button>
          </Link>
          <br></br>
          <Link href="/SignUp">
            <Button className="bg-[#3b3b82] text-white hover:bg-[#4c4c96] rounded-full hover:scale-105 transition-transform duration-300 ease-in-out">
              Devenir un membre
            </Button>
          </Link>
          <div className="mt-8 p-4 bg-[#3b3b82] rounded-lg">
            <h2 className="text-lg font-semibold mb-2 text-white">Mode Simulation Actif</h2>
            <p className="text-sm text-gray-200">Tous les échanges et soldes sur cette plateforme sont simulés. Aucune crypto-monnaie réelle n'est utilisée ou mise en risque.</p>
          </div>
        </div>
      </main>
      <footer className={`py-6 px-4 md:px-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-400'}`}>
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>© 2024 Lazuli. Tous droits réservés. Ceci est une plateforme de simulation.</p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} hover:text-gray-300`} href="#">Conditions d'utilisation</Link>
            <Link className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} hover:text-gray-300`} href="#">Politique de confidentialité</Link>
          </nav>
        </div>
      </footer>
      <ChatIcon />
    </div>
  );
}

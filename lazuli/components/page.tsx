'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-blue-900 text-blue-100">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-blue-700">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold text-xl">Lazuli</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button className="bg-green-500 text-white hover:bg-green-600 animate-pulse">
            Commencer
          </Button>
          <Link className="text-sm font-medium hover:text-blue-300" href="#">
            À propos
          </Link>
          <Link className="text-sm font-medium hover:text-blue-300" href="#">
            Aide
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 784.37 1277.39"
              className="w-full h-full text-blue-300 animate-pulse"
              aria-label="Logo Crypto animé"
            >
              <g>
                <polygon
                  fill="currentColor"
                  fillRule="evenodd"
                  points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 392.07,0"
                />
                <polygon
                  fill="currentColor"
                  fillRule="evenodd"
                  points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 392.07,0"
                />
                <polygon
                  fill="currentColor"
                  fillRule="evenodd"
                  points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 392.07,956.52"
                />
                <polygon
                  fill="currentColor"
                  fillRule="evenodd"
                  points="392.07,1277.38 392.07,956.52 0,724.89 392.07,1277.38"
                />
                <polygon
                  fill="currentColor"
                  fillRule="evenodd"
                  points="392.07,882.29 784.13,650.54 392.07,472.33 392.07,882.29"
                />
                <polygon
                  fill="currentColor"
                  fillRule="evenodd"
                  points="0,650.54 392.07,882.29 392.07,472.33 0,650.54"
                />
              </g>
            </svg>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900 opacity-50"></div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Bienvenue sur Lazuli</h1>
          <p className="text-xl text-blue-300 mb-4">Simulateur de Trading Crypto</p>
          <p className="text-md text-blue-200 mb-8">Expérimentez le trading de crypto-monnaies sans risque avec notre plateforme de simulation avancée. Perfectionnez vos stratégies sans utiliser de vraie monnaie.</p>
          <Link href="/login">
            <Button className="bg-blue-500 text-white hover:bg-blue-600">
              Démarrer la Simulation
            </Button>
          </Link>
          <h1>-------</h1>
          <Link href="/SignUp">
            <Button className="bg-blue-500 text-white hover:bg-blue-600">
              Devenir un membre
            </Button>
          </Link>
          <div className="mt-8 p-4 bg-blue-800 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Mode Simulation Actif</h2>
            <p className="text-sm text-blue-300">Tous les échanges et soldes sur cette plateforme sont simulés. Aucune crypto-monnaie réelle n'est utilisée ou mise en risque.</p>
          </div>
        </div>
      </main>
      <footer className="py-6 px-4 md:px-6 border-t border-blue-700">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-blue-400">© 2023 Lazuli. Tous droits réservés. Ceci est une plateforme de simulation.</p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link className="text-sm text-blue-400 hover:text-blue-300" href="#">
              Conditions d'utilisation
            </Link>
            <Link className="text-sm text-blue-400 hover:text-blue-300" href="#">
              Politique de confidentialité
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
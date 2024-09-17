'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a40] text-white">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-blue-700">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-xl">Lazuli</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-blue-300" href="/dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:text-blue-300" href="#">
            Transactions
          </Link>
          <Link className="text-sm font-medium hover:text-blue-300" href="#">
            Profil
          </Link>
        </nav>
      </header>

      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Solde du portefeuille */}
          <div className="bg-[#252253] p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Solde du portefeuille</h2>
            <p className="text-2xl font-bold">$63,411.00</p>
          </div>

          {/* Transactions récentes */}
          <div className="bg-[#252253] p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Transactions récentes</h2>
            <ul className="text-sm space-y-2">
              <li>Achat de Bitcoin: 0.000242 BTC</li>
              <li>Vente d'Ethereum: 2 ETH</li>
              <li>Achat de Litecoin: 5 LTC</li>
            </ul>
          </div>

          {/* Statistiques du marché */}
          <div className="bg-[#252253] p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Statistiques du marché</h2>
            <ul className="text-sm space-y-2">
              <li>Volume 24h : $1236548.325</li>
              <li>Market Cap : 19B USD</li>
              <li>Circulating Supply : 29.4M BTC</li>
            </ul>
          </div>
        </div>

        {/* Performances du portefeuille */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Performances de votre portefeuille</h2>
          <div className="bg-[#252253] p-6 rounded-lg">
            <p className="text-sm text-blue-400">Graphiques de performance à ajouter ici</p>
          </div>
        </div>
      </main>

      {/* Section Follow */}
      <aside className="w-72 bg-[#1f1b4c] p-6">
        <h2 className="text-lg font-semibold mb-4">Suivre</h2>
        <div className="bg-[#252253] p-4 mb-4 rounded-lg">
          <h3 className="text-sm">Bitcoin (24h)</h3>
          <p className="text-lg font-bold">USD 1254.36</p>
          <p className="text-green-500">+0.6%</p>
        </div>
        <div className="bg-[#252253] p-4 mb-4 rounded-lg">
          <h3 className="text-sm">Ethereum (24h)</h3>
          <p className="text-lg font-bold">USD 1254.36</p>
          <p className="text-red-500">-0.6%</p>
        </div>
        <div className="bg-[#252253] p-4 mb-4 rounded-lg">
          <h3 className="text-sm">Litecoin (24h)</h3>
          <p className="text-lg font-bold">USD 1254.36</p>
          <p className="text-green-500">+0.6%</p>
        </div>
        <div className="bg-[#252253] p-4 rounded-lg">
          <h3 className="text-sm">Ripple (24h)</h3>
          <p className="text-lg font-bold">USD 1254.36</p>
          <p className="text-red-500">-0.6%</p>
        </div>
      </aside>

      <footer className="py-6 px-4 md:px-6 border-t border-blue-700">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-blue-400">© 2024 Lazuli. Tous droits réservés. Ceci est une plateforme de simulation.</p>
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
  );
}

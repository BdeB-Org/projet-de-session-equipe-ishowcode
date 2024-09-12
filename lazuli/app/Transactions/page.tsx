'use client'

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from 'next/image'; 
import myImage from '../Images/transaction_logo.webp'; 

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 60 } },
};

export default function TransactionsPage() {
  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-[#f8f9fa] text-black"
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-white shadow-md">
        <Link className="flex items-center justify-center" href="/dashboard">
          <span className="font-bold text-xl text-[#5d3fd3]">Lazuli</span>
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/transactions">
            Transactions
          </Link>
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/profil">
            Profil
          </Link>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6">
        {/* Sidebar */}
        <motion.aside 
          className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md"
          variants={containerVariants}
        >
          <nav className="space-y-4">
            <Link className="block py-2 text-lg font-semibold hover:text-[#5d3fd3]" href="/Dashboard">
              🏠 Accueil
            </Link>
            <Link className="block py-2 text-lg font-semibold hover:text-[#5d3fd3]" href="/explore">
              🔎 Explore
            </Link>
            <Link className="block py-2 text-lg font-semibold hover:text-[#5d3fd3]" href="/transfer">
              🔄 Transfer
            </Link>
            {/* Aligner l'image et le texte sur une seule ligne */}
            <div className="flex items-center space-x-2">
              <Image src={myImage.src} alt="Transaction Icon" width={30} height={30} />
              <Link className="text-lg font-semibold hover:text-[#5d3fd3]" href="/Transactions">
                Transactions
              </Link>
            </div>
          </nav>
        </motion.aside>

        {/* Transactions panel */}
        <section className="flex-1 space-y-6">
          {/* Title */}
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md"
            variants={containerVariants}
          >
            <h2 className="text-xl font-semibold">Historique des transactions</h2>
            <p className="text-gray-600 mt-4">Aucune transaction à afficher pour le moment.</p>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 bg-white shadow-md mt-8 w-full">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-sm text-gray-500">© 2024 Lazuli. Tous droits réservés.</p>
          <nav className="flex gap-4">
            <Link className="text-sm text-gray-500 hover:text-[#5d3fd3]" href="#">
              Terms of Use
            </Link>
            <Link className="text-sm text-gray-500 hover:text-[#5d3fd3]" href="#">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </motion.div>
  );
}

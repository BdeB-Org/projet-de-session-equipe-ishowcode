'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
//page de modification du profil

// Animation 
const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 60 } },
};

const dropdownVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.6 } },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.8 } },
};
// fausses données en attendant la connextion avec la bd
export default function ProfilPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [birthDate, setBirthDate] = useState("1990-01-01"); 
  const [isEditing, setIsEditing] = useState(false); 

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-[#f8f9fa] text-black"
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-white shadow-md">
        <Link className="flex items-center" href="/dashboard">
          <span className="font-bold text-xl text-[#5d3fd3]">Lazuli</span>
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/dashboard">Dashboard</Link>
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/transactions">Transactions</Link>
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/Profil">Profil</Link>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6">
        {/* Profil*/}
        <section className="flex-1 space-y-6">
          <motion.div variants={buttonVariants} whileHover="hover">
            <Link href="/Profil">
              <Button className="bg-[#5d3fd3] text-white px-4 py-2 rounded-full hover:bg-[#4533a9] transition duration-300">
                Retour
              </Button>
            </Link>
          </motion.div>

          {/* Titre */}
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md"
            variants={containerVariants}
          >
            <h2 className="text-xl font-semibold">Mon Profil</h2>

            {/* Profil */}
            <div className="mt-4 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between">
                <p className="text-lg font-medium">Nom complet :</p>
                <p className="text-lg">Jean Dupont</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between">
                <p className="text-lg font-medium">Adresse e-mail :</p>
                <p className="text-lg">jeandupont@email.com</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between">
                <p className="text-lg font-medium">Date de naissance :</p>
                {isEditing ? (
                  <input 
                    type="date" 
                    value={birthDate} 
                    onChange={(e) => setBirthDate(e.target.value)} 
                    className="text-lg border border-gray-300 rounded px-2"
                  />
                ) : (
                  <p className="text-lg">{birthDate}</p>
                )}
                <Button onClick={() => setIsEditing(!isEditing)} >
                  {isEditing ? "Sauvegarder" : "Modifier"}
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row justify-between">
                <p className="text-lg font-medium">Gain</p>
                <p className="text-lg">$0</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <p className="text-lg font-medium">Monnai</p>
                <div className="relative">
                  <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="text-lg px-2 py-1 border rounded bg-white hover:bg-gray-100"
                  >
                    $
                  </button>
                  <motion.div 
                    variants={dropdownVariants} 
                    initial="hidden" 
                    animate={isOpen ? "visible" : "hidden"}
                    className="absolute mt-2 w-24 bg-white border rounded shadow"
                  >
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">USD</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">EUR</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">GBP</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">IDR</a>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="flex gap-4 mt-5">
              <motion.div variants={buttonVariants} whileHover="hover">
                <Button className="bg-[#5d3fd3] text-white px-4 py-2 rounded-full hover:bg-[#4533a9] transition duration-300">
                  Changer le mot de passe
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 bg-white shadow-md mt-8 w-full">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-sm text-gray-500">© 2024 Lazuli. Tous droits réservés.</p>
          <nav className="flex gap-4">
            <Link className="text-sm text-gray-500 hover:text-[#5d3fd3]" href="#">Terms of Use</Link>
            <Link className="text-sm text-gray-500 hover:text-[#5d3fd3]" href="#">Privacy Policy</Link>
          </nav>
        </div>
      </footer>
    </motion.div>
  );
}

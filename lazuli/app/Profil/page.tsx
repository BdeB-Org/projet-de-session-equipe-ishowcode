'use client'; // Ensure this is a client component

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import myImage from '../Images/transaction_logo.webp';
import accueilLogoImg from '../Images/home_logo-removebg-preview.png';
import { useRouter } from 'next/navigation'; // Correct import

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 60 } },
};

const dropdownVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

export default function ProfilPage() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // Move this inside the component

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem('userId');
  
    if (!userId) {
      alert("User not authenticated.");
      return;
    }
  
    const response = await fetch('/api/profil', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
  
    const data = await response.json();
    
    if (response.ok) {
      alert(data.message);
      router.push('/'); // Redirect to main page
    } else {
      alert(data.error || "Failed to delete account.");
    }
  };
  
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

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6">
        {/* Sidebar */}
        <motion.aside 
          className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md"
          variants={containerVariants}
        >
          <nav className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image src={accueilLogoImg.src} alt="Accueil Icon" width={30} height={30} />
              <Link className="block py-2 text-lg font-semibold hover:text-[#5d3fd3]" href="/Dashboard">Accueil</Link>
            </div>
            <div className="flex items-center space-x-2">
              <Image src={myImage.src} alt="Transaction Icon" width={30} height={30} />
              <Link className="text-lg font-semibold hover:text-[#5d3fd3]" href="/Transactions">Transactions</Link>
            </div>
          </nav>
        </motion.aside>

        {/* Profil panel */}
        <section className="flex-1 space-y-6">
          {/* Title */}
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md"
            variants={containerVariants}
          >
            <h2 className="text-xl font-semibold">Mon Profil</h2>

            {/* Profile Info */}
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
                <p className="text-lg">01 Janvier 1990</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between">
                <p className="text-lg font-medium">Mot de passe :</p>
                <p className="text-lg">********</p>
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

            {/* Buttons */}
            <div className="flex gap-4 mt-5">
              <motion.div variants={buttonVariants} whileHover="hover">
                <Link href="/ModificationProfil">
                  <Button className="bg-[#5d3fd3] text-white px-4 py-2 rounded-full hover:bg-[#4533a9] transition duration-300">
                    Modifier le profil
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={buttonVariants} whileHover="hover">
                <Button 
                  onClick={async () => {
                    const confirmDelete = window.confirm("Are you sure you want to delete?");
                    if (confirmDelete) {
                      await handleDeleteAccount();
                    }
                  }} 
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-400 transition duration-300"
                >
                  Supprimer le compte
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

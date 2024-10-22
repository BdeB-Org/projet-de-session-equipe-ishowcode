'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import myImage from '../Images/transaction_logo.webp';
import accueilLogoImg from '../Images/home_logo-removebg-preview.png';
import { useRouter } from 'next/navigation';

// Animation 
const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 60 } },
};

export default function TransactionsPage() {
  const [profilePic, setProfilePic] = useState('/images/default-avatar.png'); // Initialisation de profilePic
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  const fetchProfileData = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('User ID is missing from localStorage');
      return;
    }

    const res = await fetch(`/api/ModificationProfil?userId=${userId}`);
    const data = await res.json();

    if (res.ok) {
      setProfilePic(data.profilePic || '/images/default-avatar.png');
    } else {
      console.error('Error fetching profile data:', data.error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);
  
  return (
    <motion.div
      className="flex flex-col min-h-screen bg-[#f8f9fa] text-black"
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-white shadow-md">
        <Link className="flex items-center justify-center" href="/Dashboard">
          <span className="font-bold text-xl text-[#5d3fd3]">Lazuli</span>
        </Link>
        <nav className="ml-auto flex items-center gap-6">
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/Dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/Transactions">
            Transactions
          </Link>
          {/* Photo de profil dans le header */}
          <Link href="/Profil" className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={profilePic}
              alt="Photo de Profil"
              width={32}
              height={32}
              className="rounded-full"
            />
          </Link>
        </nav>
        <Button
          onClick={handleLogout}
          className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded ml-4"
        >
          Déconnecter
        </Button>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6">
        {/* Sidebar */}
        <motion.aside
          className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md"
          variants={containerVariants}
        >
          <nav className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image src={accueilLogoImg.src} alt="Accueil Icon" width={30} height={30} />
              <Link className="block py-2 text-lg font-semibold hover:text-[#5d3fd3]" href="/Dashboard">
                Accueil
              </Link>
            </div>
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

        {/* Transaction*/}
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

// /app/Dashboard/page.tsx

'use client';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import transactionLogoImg from '../Images/transaction_logo.webp'; 
import accueilLogoImg from '../Images/home_logo-removebg-preview.png';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 60 } },
};

export default function DashboardPage() {
  const router = useRouter(); 
  const [balance, setBalance] = useState(172.03); // Initial balance, can be fetched

  const handleLogout = () => {
    router.push('/');
  };

  const fetchBalance = async () => {
    // Fetch the balance from your API
    const res = await fetch(`/api/balance`);
    const data = await res.json();
    if (res.ok) {
      setBalance(data.balance);
    } else {
      console.error("Error fetching balance:", data.error);
    }
  };

  useEffect(() => {
    fetchBalance();
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
        <nav className="ml-auto flex gap-6">
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/Dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/Transactions">
            Transactions
          </Link>
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/Profil">
            Profil
          </Link>
        </nav>
        <Button
          onClick={handleLogout}
          className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded ml-4"
        >
          Déconnecter
        </Button>
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
              <Image src={accueilLogoImg.src} alt="Transaction Icon" width={30} height={30} />
              <Link className="block py-2 text-lg font-semibold hover:text-[#5d3fd3]" href="/Dashboard">
                Accueil
              </Link>
            </div>
            <Link className="block py-2 text-lg font-semibold hover:text-[#5d3fd3]" href="#">
              🔎 Explore
            </Link>
            <Link className="block py-2 text-lg font-semibold hover:text-[#5d3fd3]" href="#">
              🔄 Transfer
            </Link>
            <div className="flex items-center space-x-2">
              <Image src={transactionLogoImg.src} alt="Transaction Icon" width={30} height={30} />
              <Link className="text-lg font-semibold hover:text-[#5d3fd3]" href="/Transactions">
                Transactions
              </Link>
            </div>
          </nav>
        </motion.aside>

        {/* Dashboard main panel */}
        <section className="flex-1 space-y-6">
          {/* Balance summary */}
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md"
            variants={containerVariants}
          >
            <h2 className="text-xl font-semibold">Solde total</h2>
            <div className="flex items-center justify-between mt-4">
              <p className="text-4xl font-bold">CA${balance.toFixed(2)}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">Disponible pour échanger : CA$0.35</p>
          </motion.div>

          {/* Actions */}
          <motion.div 
            className="flex gap-4 justify-center"
            variants={containerVariants}
          >
            <Button className="bg-[#5d3fd3] text-white px-4 py-2 rounded-full hover:bg-[#4533a9]">
              Acheter
            </Button>
            <Button className="bg-[#5d3fd3] text-white px-4 py-2 rounded-full hover:bg-[#4533a9]">
              Vendre
            </Button>
            <Link href="/Depot">
              <Button className="bg-[#5d3fd3] text-white px-4 py-2 rounded-full hover:bg-[#4533a9]">
                Dépôt
              </Button>
            </Link>
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

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
  const [profilePic, setProfilePic] = useState('/images/default-avatar.png');
  const [transactions, setTransactions] = useState([]);
  const router = useRouter();

  const handleLogout = () => {
 
    localStorage.removeItem('userId'); 
    localStorage.removeItem('authToken'); 
  
    router.replace('/'); 
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

  const fetchTransactions = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID is missing from localStorage');
      return;
    }

    try {
      const res = await fetch(`/api/transactions?userId=${userId}`);
      const data = await res.json();

      if (res.ok) {
        setTransactions(data.transactions || []);
      } else {
        console.error('Error fetching transactions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchTransactions();
  }, []);

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-[#f8f9fa] text-black"
      initial="hidden"
      animate="visible"
    >
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-white shadow-md border-b">
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

      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6">

        <motion.aside
          className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md space-y-6"
          variants={containerVariants}
        >
          <nav className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image src={accueilLogoImg.src} alt="Accueil Icon" width={30} height={30} />
              <Link className="block py-2 text-lg font-semibold hover:text-[#5d3fd3]" href="/Dashboard">
                Accueil
              </Link>
            </div>
            <Link className="block py-2 text-lg font-semibold hover:text-[#5d3fd3]" href="/Dashboard">
              🔎 Explore
            </Link>
            <Link className="block py-2 text-lg font-semibold hover:text-[#5d3fd3] cursor-pointer" href="/Depot">
                💸 Dépot
            </Link>
            <div className="flex items-center space-x-2">
              <Image src={myImage.src} alt="Transaction Icon" width={30} height={30} />
              <Link className="text-lg font-semibold hover:text-[#5d3fd3]" href="/Transactions">
                Transactions
              </Link>
            </div>
          </nav>
        </motion.aside>

        <section className="flex-1 space-y-6">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            variants={containerVariants}
          >
            <h2 className="text-2xl font-semibold text-[#333] mb-4">Historique des transactions</h2>

            {transactions.length === 0 ? (
  <p className="text-gray-600 mt-4">Aucune transaction à afficher pour le moment.</p>
) : (
  <div className="overflow-x-auto mt-4">
    <table className="min-w-full table-auto border-collapse border border-gray-300 rounded-lg shadow-sm">
      <thead className="bg-gray-100 text-sm text-gray-700">
        <tr>
          <th className="py-2 px-4 border">Type</th>
          <th className="py-2 px-4 border">Crypto</th>
          <th className="py-2 px-4 border">Montant</th>
          <th className="py-2 px-4 border">Valeur</th>
          <th className="py-2 px-4 border">Date</th>
        </tr>
      </thead>
      <tbody>
        {/* 
        {transactions.map((transaction, index) => (
          <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
            <td className="py-2 px-4">{transaction. || 'N/A'}</td>
            <td className="py-2 px-4">{transaction.selectedCrypto || 'N/A'}</td>
            <td className="py-2 px-4">{transaction.amount || 'N/A'}</td>
            <td className="py-2 px-4">{transaction.transactionValue ? `${transaction.transactionValue} €` : 'N/A'}</td>
            <td className="py-2 px-4">
              {transaction.date ? new Date(transaction.date).toLocaleString() : 'N/A'}
            </td>
          </tr>
        ))}*/}
      </tbody>
    </table>
  </div>
)}

            
          </motion.div>
        </section>
      </main>
    </motion.div>
  );
}

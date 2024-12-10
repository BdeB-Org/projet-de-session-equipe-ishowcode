'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import accueilLogoImg from '../Images/home_logo-removebg-preview.png';
import { useRouter } from 'next/navigation';
import depotLogoImg from '../Images/money.png'
import quizLogoImg from '../Images/quiz_logo.png'
import transactionLogoImg from '../Images/transaction_logo.webp';
import ChatIcon from '@/components/chatIcon';

interface Transaction {
  transactionType: string;
  selectedCrypto: string;
  amount: number;
  transactionValue: number;
  date: string;
}

const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 60 } },
};

export default function TransactionsPage() {
  const [profilePic, setProfilePic] = useState('/images/default-avatar.png');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
      {/* Header */}
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
        {/* Sidebar */}
        <motion.aside
          className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md space-y-6"
          variants={containerVariants}
        >
          <nav className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image src={accueilLogoImg} alt="Accueil Icon" width={30} height={30} />
              <Link href="/Dashboard" replace>
                <span className="block py-2 text-lg font-semibold hover:text-[#5d3fd3] cursor-pointer">
                  Accueil
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Image src={depotLogoImg} alt="Dépôt Icon" width={30} height={30} />
              <Link href="/Depot">
                <span className="block py-2 text-lg font-semibold hover:text-[#5d3fd3] cursor-pointer">
                  Dépôt
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Image src={transactionLogoImg} alt="Transaction Icon" width={30} height={30} />
              <Link href="/Transactions">
                <span className="text-lg font-semibold hover:text-[#5d3fd3]">Transactions</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Image src={quizLogoImg.src} alt="Quiz Icon" width={30} height={30} />
              <Link className="text-lg font-semibold hover:text-[#5d3fd3]" href="/Quiz">
                Quiz d'Investissement
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
                <table className="min-w-full border-collapse rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-[#7e5dfc] text-gray-900 text-sm font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4 border-b border-gray-300 text-left">Type</th>
                      <th className="py-3 px-4 border-b border-gray-300 text-left">Crypto</th>
                      <th className="py-3 px-4 border-b border-gray-300 text-left">Montant</th>
                      <th className="py-3 px-4 border-b border-gray-300 text-left">Valeur</th>
                      <th className="py-3 px-4 border-b border-gray-300 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => {
                      const isBuy = transaction.transactionType === 'buy';
                      const rowClass = `border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`;

                      return (
                        <tr key={index} className={rowClass}>
                          <td className={`py-3 px-4 text-sm font-medium ${isBuy ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.transactionType || 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-sm">{transaction.selectedCrypto || 'N/A'}</td>
                          <td className="py-3 px-4 text-sm">{transaction.amount || 'N/A'}</td>
                          <td className="py-3 px-4 text-sm">
                            {transaction.transactionValue 
                              ? `${transaction.transactionValue.toLocaleString(undefined, {maximumFractionDigits:2})} €`
                              : 'N/A'
                            }
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {transaction.date ? new Date(transaction.date).toLocaleString() : 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </section>
      </main>
      <ChatIcon />
    </motion.div>
  );
}

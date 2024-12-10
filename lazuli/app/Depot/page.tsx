'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import accueilLogoImg from '../Images/home_logo-removebg-preview.png';
import depotLogoImg from '../Images/money.png'
import quizLogoImg from '../Images/quiz_logo.png'
import transactionLogoImg from '../Images/transaction_logo.webp';
import ChatIcon from '@/components/chatIcon';

const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 60 } },
};

export default function DepotPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('');
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const fetchData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("User ID is missing from localStorage");
      return;
    }

    try {
      const res = await fetch(`/api/ModificationProfil?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setName(data.name || '');
        setEmail(data.email || '');
        setBalance(data.balance || 0);
        setCurrency(data.currency || '');
      } else {
        console.error("Error fetching profile data:", data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMessage("Erreur lors de la récupération des données du profil.");
    }
  };

  const handleResetBalance = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const updateResponse = await fetch(`/api/updateBalance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newBalance: 0 }),
      });

      if (updateResponse.ok) {
        setBalance(0);
        setSuccessMessage("Le solde a été réinitialisé à 0.");
      } else {
        const errorData = await updateResponse.json();
        setErrorMessage("Erreur lors de la réinitialisation du solde.");
      }
    } catch (error) {
      console.error("Error resetting balance:", error);
      setErrorMessage("Erreur lors de la réinitialisation du solde.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (!isNaN(amount) && amount > 0) {
      const newBalance = balance + amount;

      try {
        const userId = localStorage.getItem('userId');
        const updateResponse = await fetch(`/api/updateBalance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, newBalance }),
        });

        if (updateResponse.ok) {
          await fetchData();
        } else {
          const errorData = await updateResponse.json();
          console.error("Error updating balance:", errorData.error);
        }

        setDepositAmount('');
        setSuccessMessage(`Déposé avec succès: ${amount.toLocaleString(undefined, {maximumFractionDigits:2})}`);
        setErrorMessage('');
      } catch (error) {
        console.error("Error updating balance:", error);
        setErrorMessage("Erreur lors de la mise à jour du solde.");
      }
    } else {
      setErrorMessage("Veuillez entrer un montant valide.");
      setSuccessMessage('');
    }
  };

  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode.toUpperCase()) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'CAD':
        return 'CA$';
      case 'IDR':
        return 'Rp';
      default:
        return currencyCode.toUpperCase() + '$';
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
        <Link className="flex items-center justify-center" href="/Dashboard" replace>
          <span className="font-bold text-xl text-[#5d3fd3]">Lazuli</span>
        </Link>
        <nav className="ml-auto flex items-center gap-6">
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/Dashboard" replace>
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/Transactions">
            Transactions
          </Link>
          <Link href="/Profil" className="relative w-8 h-8 rounded-full overflow-hidden">
            {/* Vous pouvez éventuellement ajouter une image de profil si disponible */}
            <Image
              src="/images/default-avatar.png"
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

        {/* Main Content */}
        <section className="flex-1 space-y-6">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            variants={containerVariants}
          >
            <h2 className="text-2xl font-semibold mb-4 text-[#333]">Dépôt d'Argent</h2>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mb-4">{successMessage} {getCurrencySymbol(currency)}</p>}
            
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Montant du dépôt"
                className="w-full lg:w-auto p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5d3fd3] text-black bg-white placeholder-gray-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              />
              <Button
                onClick={handleDeposit}
                className="bg-[#5d3fd3] hover:bg-[#4629a6] text-white px-6 py-3 rounded-xl transition duration-300 transform hover:scale-105 text-sm font-medium"
              >
                Déposer
              </Button>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2 text-[#333]">Informations du Compte</h3>
              <p className="text-gray-700 text-base mb-2">Nom: {name}</p>
              <p className="text-gray-700 text-base mb-2">Email: {email}</p>
              <p className="text-gray-700 text-base mb-4">
                Solde: {balance.toLocaleString(undefined, {maximumFractionDigits:2})} {getCurrencySymbol(currency)} ({currency})
              </p>
              <Button
                onClick={handleResetBalance}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition duration-300 transform hover:scale-105 text-sm font-medium"
              >
                Réinitialiser le Solde
              </Button>
            </div>
          </motion.div>
        </section>
      </main>
      <ChatIcon />
    </motion.div>
  );
}
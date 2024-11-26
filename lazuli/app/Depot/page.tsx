'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function ProfilPage() {
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
    <motion.div className="flex flex-col min-h-screen bg-gradient-to-r from-[#011c29] via-[#00354d] to-[#00354d] text-white">
      <header className="px-6 h-16 flex items-center justify-between bg-[#011c29] shadow-lg">
        <Link className="flex items-center" href="/Dashboard">
          <span className="font-extrabold text-3xl text-[#6a4fc3]">Lazuli</span>
        </Link>
        <Button onClick={handleLogout} className="bg-darkGreen hover:bg-[#004d30] transition duration-300 px-6 py-3 rounded-lg">Déconnecter</Button>
      </header>

      <main className="flex-1 flex justify-center items-center p-6">
        <motion.section className="bg-[#002a38] p-8 rounded-2xl shadow-xl w-full max-w-3xl">
          <div className="text-center mb-6">
            <div className="text-left mb-6">
              <Button 
                onClick={() => router.back()} 
                className="bg-[#006e8e] hover:bg-[#005e7a] transition duration-300 px-6 py-3 rounded-lg"
              >
                Retour
              </Button>
            </div>
            <h5 className="text-4xl font-bold mb-3">Dépôt d'Argent</h5>
            <p className="text-lg mb-4">Ajoutez un montant à votre compte</p>
            <p className="text-sm text-gray-400">Veuillez noter que les montants affichés ne sont pas réels.</p>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mb-4">{successMessage} {getCurrencySymbol(currency)}</p>}
          </div>

          <div className="flex flex-col items-center space-y-6">
            <input 
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Montant du dépôt"
              className="w-full max-w-xs p-4 rounded-xl border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6a4fc3] text-black bg-white placeholder-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105"
            />
            <Button 
              onClick={handleDeposit} 
              className="w-full max-w-xs bg-[#006e8e] hover:bg-[#005e7a] transition duration-300 px-6 py-3 rounded-xl"
            >
              Déposer
            </Button>
          </div>
          
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Informations du Compte</h2>
            <p className="text-gray-300 text-lg mb-2">Nom: {name}</p>
            <p className="text-gray-300 text-lg mb-2">Email: {email}</p>
            <p className="text-gray-300 text-lg mb-4">Solde: {balance.toLocaleString(undefined, {maximumFractionDigits:2})} {getCurrencySymbol(currency)} ({currency})</p>
            <Button 
              onClick={handleResetBalance} 
              className="w-full max-w-xs text-center bg-red-500 hover:bg-red-600 transition duration-300 px-6 py-3 rounded-xl"
            >
              Réinitialiser le Solde
            </Button>
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
}
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
  const router = useRouter();

  const handleLogout = () => {
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
  
      console.log("Fetched user data:", data); 
  
      if (res.ok) {
        setName(data.name || '');
        setEmail(data.email || '');
        setBalance(data.balance || 0);  
      } else {
        console.error("Error fetching profile data:", data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMessage("Erreur lors de la récupération des données du profil.");
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
          console.log("Balance updated successfully");
          
          await fetchData(); 
        } else {
          const errorData = await updateResponse.json();
          console.error("Error updating balance:", errorData.error);
        }
  
        setDepositAmount('');
        setSuccessMessage(`Déposé avec succès: CA$${amount.toFixed(2)}`);
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

  return (
    <motion.div className="flex flex-col min-h-screen bg-gradient-to-r from-[#0b0b3b] via-[#1e1e7f] to-[#1b1b2f] text-white">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-gray-900 shadow-lg">
        <Link className="flex items-center" href="/Dashboard">
          <span className="font-extrabold text-xl text-[#6a4fc3]">Lazuli</span>
        </Link>
        <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 transition duration-300">Déconnecter</Button>
      </header>

      <main className="flex-1 flex justify-center items-center p-6">
        <motion.section className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <div className="text-center mb-6">
            <h5 className="text-4xl font-bold mb-3">Dépôt d'Argent</h5>
            <p className="text-lg">Ajoutez un montant à votre compte</p>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
          </div>

          <div className="flex flex-col items-center">
            <input 
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Montant du dépôt"
              className="mb-4 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6a4fc3] text-green-900 w-full max-w-xs"
            />
            <Button 
              onClick={handleDeposit} 
              className="bg-[#6a4fc3] hover:bg-[#5a3fbc] transition duration-300 w-full max-w-xs"
            >
              Déposer
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Informations du Compte</h2>
            <p className="text-gray-300">Nom: {name}</p>
            <p className="text-gray-300">Email: {email}</p>
            <p className="text-gray-300">Solde: CA${balance.toFixed(2)}</p>
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
}

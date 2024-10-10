'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 

export default function ProfilPage() {
  const [profilePic, setProfilePic] = useState('/default-avatar.png');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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

      if (res.ok) {
        setName(data.name || '');
        setEmail(data.email || '');
        setProfilePic(data.profilePic || '/default-avatar.png');
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

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!isNaN(amount) && amount > 0) {
      //setBalance((prevBalance: number) => prevBalance + amount); 
      setDepositAmount('');
      setSuccessMessage(`Déposé avec succès: CA$${amount.toFixed(2)}`);
      setErrorMessage('');
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
        <Button onClick={handleLogout} className="bg-red-500">Déconnecter</Button>
      </header>

      <main className="flex-1 flex justify-center items-center p-6">
        <motion.section className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">Mon compte</h2>

          <div className="flex justify-center items-center mb-6">
            <Image src={profilePic} alt="Profile Picture" width={128} height={128} className="rounded-full" />
          </div>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          <input 
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Montant du dépôt"
            className="mb-4 p-2 rounded text-green-900"
          />
          <Button onClick={handleDeposit} className="bg-[#6a4fc3]">Déposer</Button>
        </motion.section>
      </main>
    </motion.div>
  );
}

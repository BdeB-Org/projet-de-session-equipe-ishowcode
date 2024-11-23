'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import myImage from '../Images/transaction_logo.webp';
import accueilLogoImg from '../Images/home_logo-removebg-preview.png';
import { useRouter } from 'next/navigation';
import quizLogoImg from '../Images/quiz_logo.png'
import searchLogoImg from '../Images/search.png';
import depotLogoImg from '../Images/money.png'
import transactionLogoImg from '../Images/transaction_logo.webp';


// Animations
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
  const [birthDate, setBirthDate] = useState('');
  const [profilePic, setProfilePic] = useState('/default-avatar.png');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('cad'); // État pour la devise

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    router.push('/');
  };

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
      router.push('/');
    } else {
      alert(data.error || "Failed to delete account.");
    }
  };

  // Fonction pour récupérer les données du profil
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
        setBirthDate(data.birthDate || '');
        setProfilePic(data.profilePic || '/default-avatar.png');
        setBalance(data.balance || 0);
        setCurrency(data.currency || 'cad'); // Récupérer la devise
      } else {
        console.error("Error fetching profile data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fonction pour obtenir le symbole de la devise
  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode.toLowerCase()) {
      case 'usd':
        return '$';
      case 'eur':
        return '€';
      case 'gbp':
        return '£';
      case 'cad':
        return 'CA$';
      case 'idr':
        return 'Rp';
      default:
        return currencyCode.toUpperCase() + '$';
    }
  };

  // Frontend de la page
  return (
    <motion.div
      className="flex flex-col min-h-screen bg-[#f8f9fa] text-black"
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-white shadow-md">
        <Link className="flex items-center" href="/Dashboard">
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
              src={profilePic || '/default-avatar.png'}
              alt="Photo de Profil"
              fill
              style={{ objectFit: 'cover' }}
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
              <Image src={accueilLogoImg} alt="Accueil Icon" width={30} height={30} />
              <Link href="/Dashboard" replace>
                <span className="block py-2 text-lg font-semibold hover:text-[#5d3fd3] cursor-pointer">
                  Accueil
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
            <Image src={depotLogoImg} alt="Transaction Icon" width={30} height={30} />
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
            <Image src={quizLogoImg.src} alt="Transaction Icon" width={30} height={30} />
              <Link className="text-lg font-semibold hover:text-[#5d3fd3]" href="/Quiz">
                Quiz d'Investissement
              </Link>
            </div>
          </nav>
        </motion.aside>

        {/* Profil */}
        <section className="flex-1 space-y-6">
          {/* Titre */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            variants={containerVariants}
          >
            <h2 className="text-xl font-semibold">Mon Profil</h2>

            {/* Profil */}
            <div className="mt-4 space-y-4">
              {/* Image de Profil */}
              <div className="flex justify-center">
                <div className="relative w-32 h-32 border-4 border-[#5d3fd3] rounded-full overflow-hidden">
                  <Image
                    src={profilePic}
                    alt="Photo de Profil"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-full"
                  />
                </div>
              </div>
              <hr />
              <div className="flex flex-col sm:flex-row justify-between">
                <p className="text-lg font-medium">Nom complet :</p>
                <p className="text-lg">{name}</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between">
                <p className="text-lg font-medium">Adresse e-mail :</p>
                <p className="text-lg">{email}</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between">
                <p className="text-lg font-medium">Date de naissance :</p>
                <p className="text-lg">{birthDate}</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between">
                <p className="text-lg font-medium">Montant Argent :</p>
                <p className="text-lg">
                  {getCurrencySymbol(currency)}
                  {balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between">
                <p className="text-lg font-medium">Devise :</p>
                <p className="text-lg">{currency.toUpperCase()}</p>
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
                <Link href="/Depot">
                  <Button className="bg-[#5d3fd3] text-white px-4 py-2 rounded-full hover:bg-[#4533a9] transition duration-300">
                    Dépôt
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={buttonVariants} whileHover="hover">
                <Button
                  onClick={async () => {
                    const confirmDelete = window.confirm(
                      "Êtes-vous sûr de vouloir supprimer votre compte?"
                    );
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
            <Link className="text-sm text-gray-500 hover:text-[#5d3fd3]" href="#">
              Conditions d'utilisation
            </Link>
            <Link className="text-sm text-gray-500 hover:text-[#5d3fd3]" href="#">
              Politique de confidentialité
            </Link>
          </nav>
        </div>
      </footer>
    </motion.div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ModificationProfilPage() {
  const [birthDate, setBirthDate] = useState('');
  const [profilePic, setProfilePic] = useState('/default-avatar.png');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currency, setCurrency] = useState('CAD'); // Devise sélectionnée
  const [balance, setBalance] = useState(0); // Solde actuel
  const [displayBalance, setDisplayBalance] = useState(0); // Solde affiché
  const [userCurrency, setUserCurrency] = useState('CAD'); // Devise initiale

  const router = useRouter();

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('userId'); 
    localStorage.removeItem('authToken'); 
    router.push('/'); 
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
        setCurrency(data.currency || 'CAD'); // Devise actuelle
        setUserCurrency(data.currency || 'CAD'); // Devise initiale
        setBalance(data.balance || 0); // Solde actuel
        setDisplayBalance(data.balance || 0); // Initialiser le solde affiché
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

  // Fonction pour obtenir le taux de change
  const getExchangeRate = async (fromCurrency: string, toCurrency: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
      const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.result === 'success') {
        const conversionRates = data.conversion_rates;
        const rate = conversionRates[toCurrency];
        if (rate) {
          return rate;
        } else {
          console.error(`La devise cible ${toCurrency} n'est pas disponible.`);
          return null;
        }
      } else {
        console.error('Erreur lors de la récupération du taux de change:', data['error-type'] || 'Unknown error');
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du taux de change:', error);
      return null;
    }
  };

  // Effet pour détecter le changement de devise et convertir le solde
  useEffect(() => {
    const convertBalance = async () => {
      if (currency && balance !== null) {
        if (userCurrency !== currency) {
          const rate = await getExchangeRate(userCurrency.toUpperCase(), currency.toUpperCase());
          if (rate) {
            const newBalance = balance * rate;
            setDisplayBalance(newBalance);
          } else {
            console.error('Impossible de récupérer le taux de change');
          }
        } else {
          setDisplayBalance(balance);
        }
      }
    };

    convertBalance();
  
  }, [currency]);

  // Fonction pour gérer le changement d'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setProfilePic(e.target.result as string); // Mettre à jour l'image affichée
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour soumettre les modifications
  const handleSubmit = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error("User ID is missing from localStorage");
      return;
    }

    // Réinitialiser le message d'erreur
    setErrorMessage('');

    // Valider les mots de passe si l'utilisateur a rempli les champs
    if (oldPassword || newPassword || confirmPassword) {
      if (!oldPassword || !newPassword || !confirmPassword) {
        setErrorMessage('Veuillez remplir tous les champs de mot de passe.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage('Les nouveaux mots de passe ne correspondent pas.');
        return;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

      if (!passwordRegex.test(newPassword)) {
        setErrorMessage(
          'Le nouveau mot de passe doit comporter au moins 8 caractères, inclure au moins une lettre majuscule et un caractère spécial.'
        );
        return;
      }
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('birthDate', birthDate);
    formData.append('currency', currency);

    if (oldPassword && newPassword) {
      formData.append('oldPassword', oldPassword);
      formData.append('newPassword', newPassword);
    }
    if (selectedImage) {
      formData.append('profilePic', selectedImage);
    }

    try {
      const response = await fetch('/api/ModificationProfil', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        router.push('/Profil');
      } else {
        setErrorMessage(data.error || "Une erreur s'est produite.");
      }
    } catch (error) {
      console.error('Error submitting profile data:', error);
      setErrorMessage("Une erreur s'est produite lors de la soumission.");
    }
  };

  // Fonction pour annuler les modifications
  const handleCancel = () => {
    router.push('/Profil');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-transparent shadow-md">
        <Link className="flex items-center justify-center" href="/Dashboard">
          <span className="font-bold text-2xl text-blue-300 hover:text-purple-400 transition-all">
            Lazuli
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-6">
          <Link className="text-sm font

      medium hover:text-purple-400 transition-all" href="/Dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:text-purple-400 transition-all" href="/Transactions">
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

      {/* Main content */}
      <main className="flex-1 flex justify-center items-center p-6">
        <section className="bg-gradient-to-r from-purple-700 to-blue-700 p-8 rounded-xl shadow-xl w-full max-w-4xl">
          <h2 className="text-3xl font-extrabold mb-6">Modifier Mon Profil</h2>

          {/* Afficher le message d'erreur s'il y en a */}
          {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

          {/* Profile Picture Upload */}
          <div className="flex justify-center items-center mb-6">
            <div className="relative w-32 h-32 border-4 border-blue-300 rounded-full overflow-hidden">
              <Image
                src={profilePic}
                alt="Photo de Profil"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Name Field */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Nom complet :</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg border border-gray-300 rounded px-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                placeholder="Votre nom complet"
              />
            </div>

            {/* Email Field */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Adresse e-mail :</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-lg border border-gray-300 rounded px-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                placeholder="Votre adresse e-mail"
              />
            </div>

            {/* Date of Birth Field */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Date de naissance :</p>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="text-lg border border-gray-300 rounded px-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
              />
            </div>

            {/* Balance Field */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Solde :</p>
              <p className="text-lg">
                {getCurrencySymbol(currency)}
                {displayBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>

            {/* Currency Field */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Devise :</p>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="text-lg border border-gray-300 rounded px-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
              >
                <option value="CAD">CAD</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="IDR">IDR</option>
              </select>
            </div>

            {/* Ancien Mot de Passe */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Ancien mot de passe :</p>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="text-lg border border-gray-300 rounded px-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                placeholder="Ancien mot de passe"
              />
            </div>

            {/* Nouveau Mot de Passe */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Nouveau mot de passe :</p>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="text-lg border border-gray-300 rounded px-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                placeholder="Nouveau mot de passe"
              />
            </div>

            {/* Confirmer le Nouveau Mot de Passe */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Confirmer le nouveau mot de passe :</p>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-lg border border-gray-300 rounded px-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                placeholder="Confirmer le nouveau mot de passe"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <div className="flex-1">
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200"
                  onClick={handleSubmit}
                >
                  Sauvegarder
                </Button>
              </div>
              <div className="flex-1">
                <Button
                  className="w-full bg-gray-500 text-white py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200"
                  onClick={handleCancel}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 md:px-6 border-t border-gray-700 text-center text-sm text-gray-400">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2024 Lazuli. Tous droits réservés.</p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link className="text-sm text-gray-400 hover:text-blue-300" href="#">
              Conditions d'utilisation
            </Link>
            <Link className="text-sm text-gray-400 hover:text-blue-300" href="#">
              Politique de confidentialité
            </Link>
          </nav>
        </div>
      </footer>

      {/* Styles Globaux */}
      <style jsx global>{`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        /* Vous pouvez supprimer les classes d'animation globales si elles ne sont plus nécessaires */
        .fade-in {
          animation: fadeIn 1.5s ease-in-out;
        }
        .slide-down {
          animation: slideDown 1.5s ease-in-out;
        }
        .slide-down-form1 {
          animation: slideDown 1.8s ease-in-out;
        }
        .slide-down-form2 {
          animation: slideDown 2.2s ease-in-out;
        }
        .slide-down-form3 {
          animation: slideUp 2s ease-in-out;
        }
        .slide-down-form4 {
          animation: slideUp 2.2s ease-in-out;
        }
        .slide-down-form5 {
          animation: slideUp 2.6s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0.5;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

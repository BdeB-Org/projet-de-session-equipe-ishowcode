'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 

export default function ProfilPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [profilePic, setProfilePic] = useState('/default-avatar.png');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  // Fonction pour récupérer les données du profil
  const fetchData = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error("User ID is missing from localStorage");
      return;
    }

    const res = await fetch(`/api/ModificationProfil?userId=${userId}`);
    const data = await res.json();

    if (res.ok) {
      setName(data.name || '');
      setEmail(data.email || '');
      setBirthDate(data.birthDate || '');
      setProfilePic(data.profilePic || '/default-avatar.png');
    } else {
      console.error("Error fetching profile data:", data.error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        setErrorMessage("Veuillez remplir tous les champs de mot de passe.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage("Les nouveaux mots de passe ne correspondent pas.");
        return;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

      if (!passwordRegex.test(newPassword)) {
        setErrorMessage("Le nouveau mot de passe doit comporter au moins 8 caractères, inclure au moins une lettre majuscule et un caractère spécial.");
        return;
      }
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('birthDate', birthDate);
    if (oldPassword && newPassword) {
      formData.append('oldPassword', oldPassword);
      formData.append('newPassword', newPassword);
    }
    if (selectedImage) {
      formData.append('profilePic', selectedImage);
    }

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
  };

  // Fonction pour annuler les modifications
  const handleCancel = () => {
    router.push('/Profil');
  };

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-gradient-to-r from-[#0b0b3b] via-[#1e1e7f] to-[#1b1b2f] text-white"
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-gray-900 shadow-lg">
        <Link className="flex items-center" href="/Dashboard">
          <motion.span
            className="font-extrabold text-xl text-[#6a4fc3] tracking-wider"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { type: "spring", stiffness: 60, delay: 0.1 } }}
          >
            Lazuli
          </motion.span>
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

      {/* Main content */}
      <main className="flex-1 flex justify-center items-center p-6">
        <motion.section 
          className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl"
        >
          <h2 className="text-2xl font-bold mb-6">Modifier Mon Profil</h2>

          {/* Afficher le message d'erreur s'il y en a */}
          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}

          {/* Profile Picture Upload */}
          <div className="flex justify-center items-center mb-6">
            <motion.div 
              className="relative w-32 h-32 border-4 border-[#6a4fc3] rounded-full overflow-hidden"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Image src={profilePic} alt="Profile Picture" fill style={{ objectFit: 'cover' }} className="rounded-full" />
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
            </motion.div>
          </div>

          <div className="space-y-6">
            {/* Name Field */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Nom complet :</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg border border-gray-300 rounded px-2 text-black"
              />
            </div>

            {/* Email Field */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Adresse e-mail :</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-lg border border-gray-300 rounded px-2 text-black"
              />
            </div>

            {/* Date of Birth Field */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Date de naissance :</p>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="text-lg border border-gray-300 rounded px-2 text-black"
              />
            </div>

            {/* Ancien Mot de Passe */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Ancien mot de passe :</p>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="text-lg border border-gray-300 rounded px-2 text-black"
              />
            </div>

            {/* Nouveau Mot de Passe */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Nouveau mot de passe :</p>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="text-lg border border-gray-300 rounded px-2 text-black"
              />
            </div>

            {/* Confirmer le Nouveau Mot de Passe */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Confirmer le nouveau mot de passe :</p>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-lg border border-gray-300 rounded px-2 text-black"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <motion.div>
                <Button 
                  className="bg-[#6a4fc3] text-white px-4 py-2 rounded-full hover:bg-[#5330a9] transition"
                  onClick={handleSubmit}
                >
                  Sauvegarder
                </Button>
              </motion.div>
              <motion.div>
                <Button 
                  className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition"
                  onClick={handleCancel}
                >
                  Annuler
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
}

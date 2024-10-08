'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 

const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
};

const profileSectionVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.3, duration: 0.7, ease: "easeOut" } },
};

export default function ProfilPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState('/default-avatar.png');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

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

  const router = useRouter(); 

  const handleLogout = () => {
    router.push('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage

      if (!userId) {
        console.error("User ID is missing from localStorage");
        return;
      }

      const res = await fetch(`/api/getProfile?userId=${userId}`);
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
          setProfilePic(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour soumettre les modifications
  const handleSubmit = async () => {
    const userId = localStorage.getItem('userId'); // Fetching userId from localStorage

    if (!userId) {
      console.error("User ID is missing from localStorage");
      return;
    }

    const response = await fetch('/api/ModificationProfil', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name, email, birthDate, profilePic }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message); 
      await fetchData(); 
      setIsEditing(false); 
    } else {
      alert(data.error); 
    }
  };

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-gradient-to-r from-[#0b0b3b] via-[#1e1e7f] to-[#1b1b2f] text-white"
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-gray-900 shadow-lg">
        <Link className="flex items-center" href="/dashboard">
          <motion.span
            className="font-extrabold text-xl text-[#6a4fc3] tracking-wider"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { type: "spring", stiffness: 60, delay: 0.1 } }}
          >
            Lazuli
          </motion.span>
        </Link>
        <nav className="ml-auto flex gap-6">
          {['Dashboard', 'Transactions', 'Profil'].map((item, i) => (
            <Link key={i} className="text-sm font-medium hover:text-[#6a4fc3]" href={`/${item.toLowerCase()}`}>
              {item}
            </Link>
          ))}
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
          variants={profileSectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold mb-6">Mon Profil</h2>

          {/* Profile Picture Upload */}
          <div className="flex justify-center items-center mb-6">
            <motion.div 
              className="relative w-32 h-32 border-4 border-[#6a4fc3] rounded-full overflow-hidden"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Image src={profilePic} alt="Profile Picture" fill objectFit="cover" className="rounded-full" />
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </motion.div>
          </div>

          <div className="space-y-6">
            {/* Name Field */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Nom complet :</p>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg border border-gray-300 rounded px-2 text-black"
                />
              ) : (
                <p className="text-lg">{name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Adresse e-mail :</p>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-lg border border-gray-300 rounded px-2 text-black"
                />
              ) : (
                <p className="text-lg">{email}</p>
              )}
            </div>

            {/* Date of Birth Field */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Date de naissance :</p>
              {isEditing ? (
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="text-lg border border-gray-300 rounded px-2 text-black"
                />
              ) : (
                <p className="text-lg">{birthDate}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <motion.div>
                <Button 
                  className="bg-[#6a4fc3] text-white px-4 py-2 rounded-full hover:bg-[#5330a9] transition"
                  onClick={() => {
                    if (isEditing) {
                      handleSubmit();
                    }
                    setIsEditing(!isEditing);
                  }}
                >
                  {isEditing ? "Sauvegarder" : "Modifier"}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
}
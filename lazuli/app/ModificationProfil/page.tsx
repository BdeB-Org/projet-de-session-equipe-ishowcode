'use client'; 

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image'; 


const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
};

const dropdownVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.5, ease: "easeOut" } },
};

const buttonVariants = {
  hover: { scale: 1.1, rotate: 3, transition: { duration: 0.4, yoyo: Infinity } },
  click: { scale: 0.9, transition: { type: "spring", stiffness: 200, damping: 8 } },
};

const profileSectionVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.3, duration: 0.7, ease: "easeOut" } },
};

export default function ProfilPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState('/default-avatar.png');
  const [name, setName] = useState('Jean Dupont');
  const [email, setEmail] = useState('jeandupont@email.com');

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfilePic(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const userId = 'user-id-here'; 

    const response = await fetch('/api/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name, email, birthDate, profilePic }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message); 
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
                onChange={handleProfilePicChange} 
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

            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Monnaie :</p>
              <div className="relative">
                <button 
                  onClick={() => setIsOpen(!isOpen)} 
                  className="text-lg px-3 py-2 border rounded bg-gray-700 shadow-sm hover:bg-gray-600"
                >
                  $
                </button>
                <motion.div 
                  variants={dropdownVariants} 
                  initial="hidden" 
                  animate={isOpen ? "visible" : "hidden"}
                  className="absolute mt-2 w-32 bg-gray-700 border rounded shadow"
                >
                  {['USD', 'EUR', 'GBP', 'IDR'].map((currency, idx) => (
                    <a key={idx} href="#" className="block px-4 py-2 hover:bg-gray-600">
                      {currency}
                    </a>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="click">
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

      {/* Footer */}
      <footer className="py-6 px-4 bg-gray-900 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-sm text-gray-500">© 2024 Lazuli. Tous droits réservés.</p>
          <nav className="flex gap-4">
            {['Terms of Use', 'Privacy Policy'].map((item, i) => (
              <Link key={i} className="text-sm text-gray-500 hover:text-[#6a4fc3]" href={`/${item.replace(' ', '').toLowerCase()}`}>
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </motion.div>
  );
}
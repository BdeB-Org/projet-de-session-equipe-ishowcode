"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from "framer-motion"; 

export default function ChangePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    // Vérifier si les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    const validatePassword = (password: string) => {
      const minLength = 8;
      const uppercasePattern = /[A-Z]/;
      const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
      // Vérifie si le mot de passe est assez long
      if (password.length < minLength) {
        return "Le mot de passe doit contenir au moins 8 caractères.";
      }
      // Vérifie si le mot de passe contient une lettre majuscule
      if (!uppercasePattern.test(password)) {
        return "Le mot de passe doit contenir au moins une lettre majuscule.";
      }
      // Vérifie si le mot de passe contient un caractère spécial
      if (!specialCharPattern.test(password)) {
        return "Le mot de passe doit contenir au moins un caractère spécial.";
      }
      return "";
    };

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }
    // Envoie requête à l'API pour changer le mot de passe
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, 
          password: formData.password 
        })
      });

      if (res.ok) {
        alert("Mot de passe changé avec succès !");
        router.push('/login');
      } else {
        const errorResult = await res.json();
        console.error("Erreur dans la réponse de l'API :", errorResult);
        setErrorMessage(errorResult.error || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe :", error);
      setErrorMessage("Une erreur est survenue lors du changement de mot de passe.");
    }
  };
  // Gérer les changements dans les champs de formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value 
    }));
  };
  // Frontend de la page
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-transparent">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl text-blue-300 hover:text-purple-400 transition-all slide-down">
            Lazuli
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md bg-gradient-to-r from-purple-700 to-blue-700 p-8 rounded-xl shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold mb-2 slide-down">Changer votre mot de passe</h2>
            <p className="text-lg text-gray-200 slide-down">Écrivez votre nouveau mot de passe.</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div className="slide-down-form1">
                <Label htmlFor="password" className="sr-only">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  onChange={handleInputChange}
                  value={formData.password}
                  placeholder="Nouveau mot de passe"
                  className="w-full bg-white text-blue-900 placeholder-blue-500 rounded-full px-4 py-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                />
              </div>
              <div className="slide-down-form2">
                <Label htmlFor="confirmPassword" className="sr-only">Confirmez le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  onChange={handleInputChange}
                  value={formData.confirmPassword}
                  placeholder="Confirmez le mot de passe"
                  className="w-full bg-white text-blue-900 placeholder-blue-500 rounded-full px-4 py-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm mt-2 text-center">{errorMessage}</div>
            )}

            <div className="slide-down-form3">
              <Button 
                type="submit" 
                className={`w-full ${'bg-gradient-to-r from-blue-500 to-purple-500'} text-white py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200`}
              >
                Changer le mot de passe
              </Button>
            </div>
            <div className="text-center text-sm text-blue-300 hover:text-blue-200 transition-all slide-down-form4">
              <Link href="/login">
                Vous vous souvenez de votre mot de passe ? Connectez-vous
              </Link>
            </div>
          </form>
        </motion.div>
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

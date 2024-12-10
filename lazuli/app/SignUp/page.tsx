"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const validatePassword = (password: string) => {
    const minLength = 8;
    const uppercasePattern = /[A-Z]/;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      return "Le mot de passe doit contenir au moins 8 caractères.";
    }
    if (!uppercasePattern.test(password)) {
      return "Le mot de passe doit contenir au moins une lettre majuscule.";
    }
    if (!specialCharPattern.test(password)) {
      return "Le mot de passe doit contenir au moins un caractère spécial.";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Réinitialiser le message d'erreur
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    // Valider le mot de passe
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.name} ${formData.lastName}`,
          email: formData.email,
          password: formData.password
        })
      });

      if (res.ok) {
        const result = await res.json();
        alert(`Compte créé avec succès ! ID: ${result.userId}`);
        router.push('/login');
      } else {
        const errorResult = await res.json();
        setErrorMessage(errorResult.error || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur lors de la création du compte :", error);
      setErrorMessage("Une erreur est survenue lors de la création du compte.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-700 shadow-md">
        <Link href="/" className="text-2xl font-extrabold text-blue-300 hover:text-purple-400 transition-all">
          Lazuli
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-gradient-to-r from-purple-700 to-blue-700 p-8 rounded-xl shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-extrabold tracking-wide mb-2 slide-down">Bienvenue à bord!</h2>
            <p className="text-lg text-gray-200 fade-in">Créez votre compte et commencez à pratiquer.</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="slide-down-form1">
                <Label htmlFor="name" className="sr-only">Prénom</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="given-name"
                  required
                  onChange={handleInputChange}
                  value={formData.name}
                  placeholder="Prénom"
                  className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-lg px-4 py-3 shadow-inner"
                />
              </div>
              <div className="slide-down-form2">
                <Label htmlFor="lastName" className="sr-only">Nom</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  onChange={handleInputChange}
                  value={formData.lastName}
                  placeholder="Nom"
                  className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-lg px-4 py-3 shadow-inner"
                />
              </div>
              <div className="slide-down-form3">
                <Label htmlFor="email" className="sr-only">Adresse e-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={handleInputChange}
                  value={formData.email}
                  placeholder="Adresse e-mail"
                  className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-lg px-4 py-3 shadow-inner"
                />
              </div>
              <div className="slide-down-form4">
                <Label htmlFor="password" className="sr-only">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  onChange={handleInputChange}
                  value={formData.password}
                  placeholder="Mot de passe"
                  className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-lg px-4 py-3 shadow-inner"
                />
              </div>
              <div className="slide-down-form5">
                <Label htmlFor="confirmPassword" className="sr-only">Confirmez le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  onChange={handleInputChange}
                  value={formData.confirmPassword}
                  placeholder="Confirmez le mot de passe"
                  className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-lg px-4 py-3 shadow-inner"
                />
              </div>
            </div>

            {/* Afficher le message d'erreur s'il existe */}
            {errorMessage && (
              <div className="text-red-500 text-sm mt-2 fade-in">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg shadow-lg hover:scale-105 transition-transform slide-down-form6"
            >
              S'inscrire
            </Button>
          </form>
          <div className="mt-6 text-center slide-down-form7">
            <p className="text-sm text-gray-300">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" className="text-purple-200 hover:text-purple-400 transition-all font-semibold">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>
      <footer className="py-6 px-4 border-t border-gray-700 text-center text-sm text-gray-400">
        © 2024 Lazuli. Créé pour des stars comme vous !
      </footer>
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
          animation: slideDown 2.1s ease-in-out;
        }
        .slide-down-form3 {
          animation: slideDown 2.4s ease-in-out;
        }
        .slide-down-form4 {
          animation: slideDown 2.7s ease-in-out;
        }
        .slide-down-form5 {
          animation: slideDown 3s ease-in-out;
        }
        .slide-down-form6 {
          animation: slideUp 2.4s ease-in-out;
        }
        .slide-down-form7 {
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
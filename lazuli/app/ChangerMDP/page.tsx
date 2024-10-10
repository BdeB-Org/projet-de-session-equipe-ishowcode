"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

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
    //Verifier si les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

      const validatePassword = (password: string) => {
        const minLength = 8;
        const uppercasePattern = /[A-Z]/;
        const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
        //Verifie si le mot de passe est assez long
        if (password.length < minLength) {
          return "Le mot de passe doit contenir au moins 8 caractères.";
        }
        //Verifie si le mot de passe contient une lettre majuscule
        if (!uppercasePattern.test(password)) {
          return "Le mot de passe doit contenir au moins une lettre majuscule.";
        }
        //Verifie si le mot de passe contient un caractère spécial
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
    //Envoie requete a API pour changer le mot de passe
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
  //Gérer les changements dans les champs de formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value 
    }));
  };
  //frontend de la page

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a40] text-white fade-in">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-black-700">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-xl slide-down">Lazuli</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold slide-down">Changer votre mot de passe</h2>
            <p className="mt-2 text-sm slide-down">Écrivez votre nouveau mot de passe.</p>
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
                />
              </div>
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}

            <div className="slide-down-form3">
              <Button type="submit" className="w-full bg-[#3b3b82] text-white hover:bg-[#4c4c96] text-base py-2 px-4 rounded-full">
                Changer le mot de passe
              </Button>
            </div>
          </form>
          <div className="text-center slide-down-form4">
            <Link className="text-sm text-blue-300 hover:text-blue-200" href="/login">
              Vous vous souvenez de votre mot de passe ? Connectez-vous
            </Link>
          </div>
        </div>
      </main>
      <footer className="py-6 px-4 md:px-6 border-t border-white-700">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-white-400">© 2024 Lazuli. Tous droits réservés.</p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link className="text-sm text-white-400 hover:text-blue-300" href="#">
              Conditions d'utilisation
            </Link>
            <Link className="text-sm text-white-400 hover:text-blue-300" href="#">
              Politique de confidentialité
            </Link>
          </nav>
        </div>
      </footer>
      //
      <style jsx global>{`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        .fade-in {
          animation: fadeIn 1.5s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0.5;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Appel à l'API de connexion
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();
      // Vérifie si la connexion réussit ou échoue
      if (res.ok) {
        localStorage.setItem('userId', result.userId);
        alert(`Connexion réussie !`);
        router.push('/Dashboard');
      } else {
        alert(result.error || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Erreur lors de la connexion. Veuillez vérifier la console pour plus d'informations.");
    }
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
            <h2 className="text-4xl font-extrabold tracking-wide mb-2 slide-down">Content de vous revoir !</h2>
            <p className="text-lg text-gray-200 fade-in">Connectez-vous pour continuer votre aventure.</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="slide-down-form1">
                <Label htmlFor="email-address" className="sr-only">Adresse e-mail</Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Adresse e-mail"
                  className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-lg px-4 py-3 shadow-inner"
                />
              </div>
              <div className="slide-down-form2">
                <Label htmlFor="password" className="sr-only">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Mot de passe"
                  className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-lg px-4 py-3 shadow-inner"
                />
                <div className="text-center slide-down-form3 mt-2">
                  <Link className="text-sm text-blue-200 hover:text-blue-400 transition-all font-semibold" href="/MDP">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg shadow-lg hover:scale-105 transition-transform slide-down-form4"
            >
              Se connecter
            </Button>
          </form>
          <div className="mt-6 text-center slide-down-form5">
            <p className="text-sm text-gray-300">
              Vous n'avez pas de compte ?{' '}
              <Link href="/SignUp" className="text-purple-200 hover:text-purple-400 transition-all font-semibold">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </main>
      <footer className="py-6 px-4 border-t border-gray-700 text-center text-sm text-gray-400">
        © 2024 Lazuli. Heureux de vous revoir parmi les étoiles !
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
          animation: slideDown 2.2s ease-in-out;
        }
        .slide-down-form3 {
          animation: slideUp 2s ease-in-out;
        }
        .slide-down-form4 {
          animation: slideUp 2.4s ease-in-out;
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
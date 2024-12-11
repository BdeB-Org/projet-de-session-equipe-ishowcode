"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { motion } from "framer-motion"; 

export default function RequestPasswordReset() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/MDP/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Envoie l'email 
        body: JSON.stringify({ email }),
      });

      setLoading(false); 

      if (res.ok) {
        alert("Un lien de réinitialisation a été envoyé à votre adresse e-mail !");
        router.push('/miseAJourPasswordSucces');
      } else {
        const result = await res.json();
        alert(result.error || "Une erreur est survenue.");
      }
    } catch (error) {
      setLoading(false); 
      console.error("Erreur lors de l'envoi de l'email :", error);
      alert("Erreur lors de l'envoi de l'email. Veuillez vérifier la console pour plus d'informations.");
    }
  };

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
            <h2 className="text-3xl font-extrabold mb-2 slide-down">Réinitialiser votre mot de passe</h2>
            <p className="text-lg text-gray-200 slide-down">
              Vous avez oublié votre mot de passe!<br />
              Entrez votre adresse courriel
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div className="slide-down-form1">
                <Label htmlFor="email" className="sr-only">Adresse e-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full bg-white text-blue-900 placeholder-blue-500 rounded-full px-4 py-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                  placeholder="Adresse e-mail"
                />
              </div>
              <div className="text-center text-sm text-blue-300 hover:text-blue-200 transition-all slide-down-form4">
                Vous recevrez un email pour réinitialiser votre mot de passe
              </div>
            </div>
            <div>
              <Button 
                type="submit" 
                className={`w-full ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-500'} text-white py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 slide-down-form3`}
                disabled={loading}
              >
                {loading ? 'Envoi...' : 'Envoyer'}
              </Button>
              <div className="text-center text-sm text-blue-300 hover:text-blue-200 transition-all slide-down-form4 mt-4">
                <Link href="/login">Vous vous souvenez de votre mot de passe? Connectez-vous</Link>
              </div>
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

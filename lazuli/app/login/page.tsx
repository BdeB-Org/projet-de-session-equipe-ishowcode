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

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.ok) {
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
    <div className="flex flex-col min-h-screen bg-[#1a1a40] text-white">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-black-700">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-xl slide-down">Lazuli</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-[3rem] font-bold slide-down">Connexion à votre compte</h2>
            <p className="mt-2 text-sm text-blue-300 slide-down">
              Entrez vos identifiants pour accéder à la simulation
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
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
                  className="bg-white text-blue-900 placeholder-blue-150 rounded-full text-lg py-3 px-4"
                  placeholder="Adresse e-mail"
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
                  className="bg-white text-blue-900 placeholder-blue-150 rounded-full text-lg py-3 px-4"
                  placeholder="Mot de passe"
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full bg-[#3b3b82] text-white hover:bg-[#4c4c96] text-base py-2 px-4 rounded-full slide-down-form3">
                Se connecter
              </Button>
            </div>
          </form>
          <div className="text-center slide-down-form3">
            <Link className="text-sm text-blue-300 hover:text-blue-200" href="#">
              Mot de passe oublié ?
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
    </div>
  );
}

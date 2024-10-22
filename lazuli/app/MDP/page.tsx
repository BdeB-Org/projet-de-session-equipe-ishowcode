"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

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
        //envoie l'email 
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
  //frontend de la page
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
            <h2 className="mt-6 text-[3rem] font-bold slide-down">Réinitialiser votre mot de passe</h2>
            <p className="mt-2 text-sm text-blue-300 slide-down">
              Vous avez oublié votre mot de passe!
              <br />
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
                  className="bg-white text-blue-900 placeholder-blue-150 rounded-full text-lg py-3 px-4"
                  placeholder="Adresse e-mail"
                />
              </div>
              <div className="text-center slide-down-form4 text-sm text-blue-300 hover:text-blue-200">
              Vous recevrez un email pour réinitialiser votre mot de passe
            </div>
            </div>
            <div>
              <Button 
                type="submit" 
                className={`w-full ${loading ? 'bg-gray-500' : 'bg-[#3b3b82]'} text-white hover:bg-[#4c4c96] text-base py-2 px-4 rounded-full slide-down-form3`}
                disabled={loading}
              >
                {loading ? 'Envoi...' : 'Envoyer'}
              </Button>
              <div  className="text-center slide-down-form4 text-sm text-blue-300 hover:text-blue-200">
              <Link href="/login">Vous vous souvenez de votre mot de passe? Connectez vous</Link>
            </div>
            </div>
            
            
          </form>
          
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

"use client"; // Add this directive to mark the component as a Client Component

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
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
            <h2 className="mt-6 text-3xl font-bold slide-down">Créer un compte</h2>
            <p className="mt-2 text-sm  slide-down">
              Remplissez les informations ci-dessous pour créer votre compte.
            </p>
          </div>
          <form className="mt-8 space-y-6 " action="#" method="POST">
            <div className="space-y-4 rounded-md shadow-sm">
              <div className= "slide-down-form1">
                <Label htmlFor="name" className="sr-only">
                Prénom
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="bg-white text-blue-100 placeholder-blue-400 focus:ring rounded-full text-lg py-3 px-4"
                  placeholder="Prénom"
                />
              </div>
              <div className= "slide-down-form2">
                <Label htmlFor="name" className="sr-only">
                  Nom
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="bg-white text-blue-100 placeholder-blue-400 focus:ring rounded-full text-lg py-3 px-4"
                  placeholder="Nom"
                />
              </div>
              <div className= "slide-down-form3">
                <Label htmlFor="email-address" className="sr-only">
                  Adresse e-mail
                </Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="bg-white text-white-100 placeholder-blue-400 focus:ring rounded-full text-lg py-3 px-4"
                  placeholder="Adresse e-mail"
                />
              </div>
              <div className= "slide-down-form4">
                <Label htmlFor="password" className="sr-only">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="bg-white text-blue-900 placeholder-blue-150 focus:ring rounded-full text-lg py-3 px-4"
                  placeholder="Mot de passe"
                />
              </div>
              <div className= "slide-down-form5">
                <Label htmlFor="confirm-password" className="sr-only">
                  Confirmez le mot de passe
                </Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="bg-white text-blue-900 placeholder-blue-150 focus:ring rounded-full text-lg py-3 px-4"
                  placeholder="Confirmez le mot de passe"
                />
              </div>
            </div>
            <div className="slide-down-form6">
            <div className="hover:animate-pulse">
                <Button type="submit" className="w-full bg-[#3b3b82] text-white hover:bg-[#4c4c96] text-base py-2 px-4 rounded-full slide-down-form3">
                S'inscrire
                </Button>
            </div>

            </div>
          </form>
          <div className="text-center slide-down-form7">
            <Link className="text-sm text-blue-300 hover:text-blue-200" href="/login">
              Vous avez déjà un compte ? Connectez-vous
            </Link>
          </div>
        </div>
      </main>
      <footer className="py-6 px-4 md:px-6 border-t border-white-700">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-white-400">© 2024 Lazuli. Tous droits réservés. Ceci est une plateforme de simulation.</p>
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
          animation: slideDown 2.6s ease-in-out;
        }
          .slide-down-form4 {
          animation: slideDown 3.0s ease-in-out;
        }
          .slide-down-form5 {
          animation: slideDown 3.4s ease-in-out;
        }
        .slide-down-form6 {
          animation: slideUp 1.5s ease-in-out;
        }
          .slide-down-form7 {
          animation: slideUp 2s ease-in-out;
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

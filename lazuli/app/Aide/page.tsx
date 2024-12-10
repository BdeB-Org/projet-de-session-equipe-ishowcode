"use client";

import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";

//page de support lazuli

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "Qu'est-ce que Lazuli ?",
      answer:
        "Lazuli est une plateforme de simulation de trading en cryptomonnaies qui vous permet d'expérimenter et de développer vos stratégies de trading sans risque financier réel. Notre objectif est de fournir un environnement sécurisé et réaliste pour que les utilisateurs puissent apprendre et maîtriser le trading de cryptomonnaies avant de s'engager dans des transactions réelles.",
    },
    {
      question: "Comment sécuriser mon portefeuille ?",
      answer:
        "Pour sécuriser votre portefeuille, utilisez des mots de passe forts, activez l'authentification à deux facteurs (2FA) et sauvegardez régulièrement vos clés privées dans un endroit sûr.",
    },
    {
      question: "Comment puis-je récupérer mon compte ?",
      answer:
        "Si vous perdez l'accès à votre compte, utilisez les options de récupération fournies lors de l'inscription, telles que les codes de récupération ou les réponses aux questions de sécurité.",
    },
    {
      question: "Comment contacter le support ?",
      answer:
        "Vous pouvez contacter le support par e-mail à support@lazuli.com ou utiliser le formulaire de contact sur notre site web.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      {/* Animation de Fond */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-800 opacity-60 z-10 beat-animation"></div>

      {/* En-tête */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-700 z-20">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl lazuli-logo lazuli-glow lazuli-pulse hover:text-blue-500 transition-all duration-300">
            Lazuli
          </span>
        </Link>
      </header>

      {/* Contenu Principal du Support */}
      <main className="relative flex-1 flex items-center justify-center p-6 z-20">
        <div className="w-full max-w-3xl space-y-10">
          <div className="text-center">
            <h2 className="mt-4 text-4xl font-bold lazuli-header lazuli-glow lazuli-pulse animate-wave">
              Centre de Support
            </h2>
            <p className="mt-4 text-lg text-blue-200 lazuli-text lazuli-pulse animate-wave music-pulse">
              Comment pouvons-nous vous aider aujourd'hui ? Recherchez de l'aide ci-dessous.
            </p>
          </div>

          {/* Barre de Recherche */}
          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              className="w-full p-4 pl-12 border border-gray-500 rounded-lg text-white bg-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 lazuli-neon-pulse lazuli-border-glow lazuli-shadow"
              placeholder="Rechercher de l'aide"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-6 h-6 lazuli-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>

          {/* Accordéon pour les FAQ */}
          <Accordion.Root type="single" collapsible className="space-y-4">
            {filteredFaqs.length ? (
              filteredFaqs.map((faq, index) => (
                <Accordion.Item
                  key={index}
                  value={faq.question}
                  className="border border-gray-600 rounded-lg p-4 transition-all duration-300 hover:bg-blue-500"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="text-xl font-semibold transition-all duration-300">
                      {faq.question}
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content
                    className={`accordion-content ${
                      faq.question === filteredFaqs.find(f => f.question === faq.question)?.question
                        ? 'accordion-content-enter'
                        : 'accordion-content-exit'
                    }`}
                  >
                    <div className="mt-2 text-base text-blue-100">
                      {faq.answer}
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              ))
            ) : (
              <div className="text-center text-blue-200">
                Aucun résultat trouvé pour "{searchQuery}".
              </div>
            )}
          </Accordion.Root>
        </div>
      </main>

       {/* Footer */}
       <footer className="py-6 px-8 border-t border-gray-700 text-center text-sm text-gray-400">
        <p className="mb-4">© 2024 Lazuli. Tous droits réservés. Ceci est une plateforme de simulation.</p>
        <nav className="space-x-6">
          <Link href="#" className="hover:text-[#00FF91] transition-all duration-300 ease-in-out transform hover:scale-110">
            Conditions d'utilisation
          </Link>
          <Link href="#" className="hover:text-[#00FF91] transition-all duration-300 ease-in-out transform hover:scale-110">
            Politique de confidentialité
          </Link>
        </nav>
      </footer>
      
      <style jsx global>{`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        .lazuli-background {
          background: radial-gradient(circle, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 1) 100%);
          animation: lazuliBackgroundAnimation 20s linear infinite;
        }

        @keyframes lazuliBackgroundAnimation {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }

        .lazuli-glow {
          text-shadow: 0 0 20px #00bfff, 0 0 40px #00bfff, 0 0 60px #00bfff;
        }

        @keyframes lazuliPulse {
          0% {
            text-shadow: 0 0 20px #00bfff, 0 0 40px #00bfff, 0 0 60px #00bfff;
          }
          50% {
            text-shadow: 0 0 30px #00bfff, 0 0 60px #00bfff, 0 0 80px #00bfff;
          }
          100% {
            text-shadow: 0 0 20px #00bfff, 0 0 40px #00bfff, 0 0 60px #00bfff;
          }
        }

        .lazuli-pulse {
          animation: lazuliPulse 1.5s ease-in-out infinite;
        }

        @keyframes lazuliWaterEffect {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }

        .lazuli-neon-pulse {
          background: linear-gradient(45deg, rgba(0, 255, 255, 0.2) 25%, rgba(0, 255, 255, 0.4) 50%, rgba(0, 255, 255, 0.2) 75%);
          background-size: 200% 200%;
          animation: lazuliWaterEffect 4s ease-in-out infinite;
        }

        @keyframes lazuliShadowEffect {
          0% {
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
          }
          100% {
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          }
        }

        .lazuli-shadow {
          animation: lazuliShadowEffect 2s ease-in-out infinite;
        }

        .music-pulse {
          animation: musicPulse 1.5s ease-in-out infinite;
        }

        @keyframes musicPulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .accordion-content {
          overflow: hidden;
          transition: max-height 0.7s ease-out, opacity 0.7s ease-out;
        }

        .accordion-content-enter {
          animation: fadeIn 0.7s forwards;
        }

        .accordion-content-exit {
          animation: fadeOut 0.7s forwards;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }

        @keyframes beatAnimation {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }

        .beat-animation {
          animation: beatAnimation 5s ease-in-out infinite;
        }

        .lazuli-hover-effect:hover {
          transform: scale(1.05);
          box-shadow: 0 0 15px #00bfff, 0 0 30px #00bfff;
        }

        .lazuli-hover-text:hover {
          color: #00bfff;
          text-shadow: 0 0 15px #00bfff, 0 0 30px #00bfff;
        }

        .lazuli-icon {
          transition: color 0.3s ease-in-out;
        }

        .lazuli-icon:hover {
          color: #00bfff;
        }
      `}</style>
    </div>
  );
}
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PasswordResetSuccess() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-transparent">
        <Link className="flex items-center justify-center" href="/">
          <motion.span
            className="font-bold text-2xl text-blue-300 hover:text-purple-400 transition-all"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            Lazuli
          </motion.span>
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
            <motion.h2
              className="text-3xl font-extrabold mb-2"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1.5 }}
            >
              Succès
            </motion.h2>
            <motion.p
              className="text-lg text-blue-300"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1.5 }}
            >
              Un courriel a été envoyé. Suivez les instructions dans le courriel pour réinitialiser votre mot de passe.
            </motion.p>
          </div>

          <div className="space-y-6">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1.5 }}
            >
              <Link href="/login">
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200"
                >
                  Retour
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="text-center text-sm text-blue-300 hover:text-blue-200 transition-all"
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.5 }}
            >
              <Link href="/a">
                Je ne veux pas retourner
              </Link>
            </motion.div>
          </div>
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

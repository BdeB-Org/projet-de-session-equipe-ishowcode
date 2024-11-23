// /app/Quiz/page.tsx

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Quiz from '@/components/quiz';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import myImage from '../Images/transaction_logo.webp';
import accueilLogoImg from '../Images/home_logo-removebg-preview.png';
import quizLogoImg from '../Images/quiz_logo.png'
import depotLogoImg from '../Images/money.png'
import ChatIcon from '@/components/chatIcon';



const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 60 } },
};

export default function QuizPage() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizResponse, setQuizResponse] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [profilePic, setProfilePic] = useState('/images/default-avatar.png');

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    router.push('/');
  };

  // Fonction appelée à la complétion du quiz
  const handleQuizComplete = async (answers: string[]) => {
    setQuizCompleted(true);
    setQuizAnswers(answers);
    setIsTyping(true);

    // Envoyer les réponses au chatbot Gemini
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Quiz terminé', messages: [], answers: answers }),
      });
      const data = await response.json();
      setQuizResponse(data.reply);
    } catch (error) {
      console.error("Erreur lors de l'envoi du quiz:", error);
      setQuizResponse('Désolé, une erreur est survenue.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-[#f8f9fa] text-black"
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-white shadow-md">
        <Link className="flex items-center" href="/Dashboard">
          <span className="font-bold text-xl text-[#5d3fd3]">Lazuli</span>
        </Link>
        <nav className="ml-auto flex items-center gap-6">
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/Dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/Transactions">
            Transactions
          </Link>
          {/* Photo de profil dans le header */}
          <Link href="/Profil" className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={profilePic || '/default-avatar.png'}
              alt="Photo de Profil"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-full"
            />
          </Link>
        </nav>
        <Button
          onClick={handleLogout}
          className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded ml-4"
        >
          Déconnecter
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6">
        {/* Sidebar */}
        <motion.aside
          className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md space-y-6"
          variants={containerVariants}
        >
          <nav className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image src={accueilLogoImg.src} alt="Accueil Icon" width={30} height={30} />
              <Link className="block py-2 text-lg font-semibold hover:text-[#5d3fd3]" href="/Dashboard">
                Accueil
              </Link>
            </div>
            <div className="flex items-center space-x-2">
            <Image src={depotLogoImg} alt="Transaction Icon" width={30} height={30} />
              <Link href="/Depot">
                <span className="block py-2 text-lg font-semibold hover:text-[#5d3fd3] cursor-pointer">
                  Dépôt
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Image src={myImage.src} alt="Transaction Icon" width={30} height={30} />
              <Link className="text-lg font-semibold hover:text-[#5d3fd3]" href="/Transactions">
                Transactions
              </Link>
            </div>
            <div className="flex items-center space-x-2">
            <Image src={quizLogoImg.src} alt="Transaction Icon" width={30} height={30} />
              <Link className="text-lg font-semibold text-[#5d3fd3]" href="/Quiz">
                Quiz d'Investissement
              </Link>
            </div>
          </nav>
        </motion.aside>

        {/* Quiz Section */}
        <section className="flex-1 space-y-6">
          {!quizCompleted && (
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              variants={containerVariants}
            >
              <Quiz onComplete={handleQuizComplete} />
            </motion.div>
          )}

          {/* Affichage de la réponse du Quiz */}
          {quizCompleted && (
            <div className="mt-6 p-4 bg-blue-100 rounded-lg shadow-inner">
              <h3 className="text-lg font-semibold">Votre Profil d'Investisseur :</h3>
              {isTyping ? (
                <p className="mt-2">Analyse en cours...</p>
              ) : (
                <p className="mt-2">{quizResponse}</p>
              )}
              <Button
                className="mt-4 bg-[#5d3fd3] text-white px-4 py-2 rounded-full hover:bg-[#4533a9] transition duration-300"
                onClick={() => {
                  // Réinitialiser le quiz pour le refaire
                  setQuizCompleted(false);
                  setQuizAnswers([]);
                  setQuizResponse('');
                }}
              >
                Refaire le Quiz
              </Button>
            </div>
          )}
        </section>
      </main>
      <ChatIcon/>
    </motion.div>
  );
}

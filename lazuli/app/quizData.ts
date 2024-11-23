// data/quizData.ts

export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
  }
  
  export const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "Quel est votre horizon d'investissement préféré?",
      options: ["Court terme (moins de 3 ans)", "Moyen terme (3-7 ans)", "Long terme (plus de 7 ans)"],
    },
    {
      id: 2,
      question: "Comment réagiriez-vous si votre investissement perdait 20% de sa valeur en un an?",
      options: ["Je vendrais immédiatement pour éviter de plus grosses pertes", "Je resterais calme et attendrais une reprise", "J'achèterais davantage pour profiter des prix bas"],
    },
    {
        id: 3,
        question: "Quel niveau de connaissance avez-vous en matière d'investissement ?",
        options: ["Débutant - Je découvre l'investissement.", "Intermédiaire - J'ai quelques expériences et connaissances.", "Avancé - Je suis bien informé et expérimenté."],
      },
      {
        id: 4,
        question: "Quelle est votre expérience en matière d'investissement ?",
        options: ["Aucune expérience", "Quelques années d'expérience", "Plus de cinq ans d'expérience"],
      },
      {
        id: 5,
        question: "Préférez-vous investir de manière active ou passive ?",
        options: ["Active - Je gère activement mes investissements.", "Passive - Je préfère des investissements à long terme et sans intervention fréquente.", "Je ne suis pas sûr."],
      },
      {
        id: 6,
        question: "Quelle proportion de votre revenu annuel êtes-vous prêt à investir ?",
        options: ["Moins de 10%", "10-20%", "Plus de 20%"],
      },
  ];
  
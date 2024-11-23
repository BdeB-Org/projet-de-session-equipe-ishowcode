import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sanitizeHtml from 'sanitize-html';

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("La variable d'environnement API_KEY n'est pas définie");
}

// Initialisation de GoogleGenerativeAI avec la clé API
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Fonction pour résumer les réponses du quiz
function summarizeQuizAnswers(answers: string[]): string {
  return answers
    .map((answer, index) => `Question ${index + 1}: ${answer}`)
    .join('\n');
}

export async function POST(req: Request) {
  const { message, messages, answers } = await req.json();

  const context = messages
    .map((msg: any) => `${msg.fromUser ? 'Utilisateur' : 'Gemini'}: ${msg.text}`)
    .join('\n');

  // Filtre le message d'utilisateur
  const sanitizedMessage = sanitizeHtml(message, {
    allowedTags: [],
    allowedAttributes: {},
  });

 // Le prompt système pour guider le modèle
  const systemPrompt = `Vous êtes un assistant virtuel utile nommé Gemini. Vous aidez les utilisateurs avec leurs questions sur notre site web de Crypto Simulation. Vous aidez également à déterminer le profil d'investisseur de l'utilisateur en fonction de ses réponses à un quiz. Après avoir reçu les réponses du quiz, vous devez analyser ces réponses et fournir un profil d'investisseur clair et concis avec un francais niveau intermédiare, limité à 4 lignes. Commencez toujours votre réponse par "Votre profil d'investissement est : [Type de profil]" où "[Type de profil]" est un type de profil d'investisseur de maximum 3 mots commençant par une lettre majuscule. Ensuite, fournissez des recommandations pertinentes. N'oubliez pas que la réponse totale doit être de 4 lignes maximum. Soyez bref et mettez en évidence les points clés.`;

  // Résumé des réponses du quiz
  let quizInstruction = '';
  if (answers && Array.isArray(answers) && answers.length > 0) {
    const summarizedAnswers = summarizeQuizAnswers(answers);
    quizInstruction = `\n\nL'utilisateur a terminé le quiz avec les réponses suivantes:\n${summarizedAnswers}\n\nVeuillez analyser ces réponses et déterminer le profil d'investisseur de l'utilisateur en respectant les instructions ci-dessus.`;
  }

  // Construction du prompt final en combinant le prompt système, le contexte, le nouveau message et les instructions du quiz
  const promptText = `${systemPrompt}\n${context}\nUtilisateur: ${sanitizedMessage}\nGemini:${quizInstruction}`;

  try {
    // Appel à l'API pour générer la réponse en utilisant le modèle 'gemini-1.5-pro'
    const result = await model.generateContent(promptText);

    // Vérification si une réponse est retournée
    if (result.response && result.response.text()) {
      const reply = result.response.text();
      return NextResponse.json({ reply });
    } else {
      console.error('Aucun candidat retourné par le modèle.');
      return NextResponse.json(
        { reply: 'Erreur : Aucun candidat retourné par Gemini' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Erreur:', error);

    const errorMessage = error.message || 'Erreur : Impossible de récupérer une réponse de Gemini';

    return NextResponse.json({ reply: errorMessage }, { status: 500 });
  }
}

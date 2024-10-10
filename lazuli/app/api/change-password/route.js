import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
//Fonction pour changer le mot de passe
export async function POST(req) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: "Token et mot de passe requis." }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    const users = db.collection('utilisateur');

    const user = await users.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) {
      return NextResponse.json({ error: "Token invalide ou expiré." }, { status: 400 });
    }
    //Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    //Mise à jour du mot de passe
    await users.updateOne(
      { _id: user._id },
      { 
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" }
      }
    );
    //Retour un message si le mot de passe a été changé
    return NextResponse.json({ message: "Mot de passe changé avec succès." });
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe :", error);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement du mot de passe." }, { status: 500 });
  }
}
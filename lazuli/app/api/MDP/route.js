// pages/api/requestPasswordReset.js
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    console.log("Requête reçue"); 
    const { email } = await req.json();
    console.log("Email reçu:", email); 

    const { db } = await connectToDatabase();
    const users = db.collection("utilisateur");

    const user = await users.findOne({ email: email });
    console.log("Utilisateur trouvé:", user); 

    if (!user) {
      console.log("Aucun utilisateur trouvé"); 
      return NextResponse.json({ error: "Aucun utilisateur trouvé avec cet e-mail." }, { status: 404 });
    }

    const resetLink = `localhost:3000/changerPassword${encodeURIComponent(email)}`;
    console.log("Lien de réinitialisation:", resetLink); 

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe: ${resetLink}`,
    });

    console.log("E-mail envoyé avec succès"); // Log de succès
    return NextResponse.json({ message: "Un lien de réinitialisation a été envoyé à votre adresse e-mail." });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'email." }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { email } = await req.json();

    const { db } = await connectToDatabase();
    const users = db.collection("utilisateur");

    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Aucun utilisateur trouvé avec cet e-mail." }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/ChangerMDP?token=${token}`;

    await users.updateOne(
      { email },
      { $set: { resetToken: token, resetTokenExpiry: Date.now() + 3600000 } } 
    );

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
      html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe: <a href="${resetLink}">Réinitialiser le mot de passe</a></p>`,
    });

    return NextResponse.json({ message: "Un lien de réinitialisation a été envoyé à votre adresse e-mail." });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'email." }, { status: 500 });
  }
}
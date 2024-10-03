import { connectToDatabase } from '@/lib/mongodb';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe requis." });
      }
  
      try {
        const { db } = await connectToDatabase();
        const users = db.collection('utilisateur');
  
        // Assuming you have a method to find the user and update the password
        const user = await users.findOne({ email });
        if (!user) {
          return res.status(404).json({ error: "Aucun utilisateur trouvé." });
        }
  
        // Update the user's password in your database
        await users.updateOne({ email }, { $set: { password } });
  
        return res.status(200).json({ message: "Mot de passe changé avec succès." });
      } catch (error) {
        console.error("Erreur lors du changement de mot de passe :", error);
        return res.status(500).json({ error: "Erreur lors de l'enregistrement du mot de passe." });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }

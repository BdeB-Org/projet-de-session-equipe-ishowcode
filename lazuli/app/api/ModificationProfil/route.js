// /app/api/ModificationProfil/route.js

import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { join } from 'path';
import { promises as fs } from 'fs';
import bcrypt from 'bcrypt';

// Assurez-vous que MONGODB_URI est défini dans vos variables d'environnement
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db("lazulibd"); // Remplacez "lazulibd" par le nom de votre base de données
  }
}

// Gestion de la méthode GET pour récupérer les informations du profil
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    await connectToDatabase();

    const user = await db.collection('utilisateur').findOne({ _id: new ObjectId(userId) });

    if (user) {
      return NextResponse.json({
        name: user.name,
        email: user.email,
        balance: user.balance || 0,
        birthDate: user.birthDate,
        profilePic: user.profilePic,
        currency: user.currency || 'cad', // Ajout de la devise
      });
    } else {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du profil:", err);
    return NextResponse.json({ error: "Une erreur s'est produite lors de la récupération du profil" }, { status: 500 });
  }
}

// Gestion de la méthode POST pour mettre à jour le profil
export async function POST(request) {
  try {
    await connectToDatabase();

    const formData = await request.formData();

    const userId = formData.get('userId');
    const name = formData.get('name');
    const email = formData.get('email');
    const birthDate = formData.get('birthDate');
    const currency = formData.get('currency'); // Récupérer la devise

    const oldPassword = formData.get('oldPassword');
    const newPassword = formData.get('newPassword');

    const profilePic = formData.get('profilePic');

    const users = db.collection('utilisateur');

    // Vérifier si l'utilisateur existe
    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé." }, { status: 404 });
    }

    // Mise à jour des champs de profil
    const updateFields = {
      name,
      email,
      birthDate,
      currency, // Ajouter la devise aux champs à mettre à jour
    };

    // Gestion de la photo de profil
    let profilePicUrl = null;

    if (profilePic && typeof profilePic === 'object' && profilePic.size > 0) {
      // Valider le type de fichier
      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'].includes(profilePic.type)) {
        return NextResponse.json({ error: "Type de fichier non supporté" }, { status: 400 });
      }

      // Lire le contenu du fichier
      const buffer = Buffer.from(await profilePic.arrayBuffer());

      // Définir le chemin d'enregistrement
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      const fileName = `${userId}_${Date.now()}_${profilePic.name}`;
      const filePath = join(uploadDir, fileName);

      // Enregistrer le fichier
      await fs.writeFile(filePath, buffer);

      profilePicUrl = `/uploads/${fileName}`;
    }

    if (profilePicUrl) {
      updateFields.profilePic = profilePicUrl;
    }

    // Gestion du changement de mot de passe
    if (oldPassword && newPassword) {
      // Vérifier l'ancien mot de passe
      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return NextResponse.json({ error: "L'ancien mot de passe est incorrect." }, { status: 400 });
      }

      // Exigences du mot de passe
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

      if (!passwordRegex.test(newPassword)) {
        return NextResponse.json({ error: "Le nouveau mot de passe doit comporter au moins 8 caractères, inclure au moins une lettre majuscule et un caractère spécial." }, { status: 400 });
      }

      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      updateFields.password = hashedPassword;
    }

    // Mettre à jour les informations de l'utilisateur
    const updatedUser = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateFields }
    );

    if (updatedUser.modifiedCount > 0) {
      return NextResponse.json({ message: "Profil mis à jour avec succès" });
    } else {
      return NextResponse.json({ error: "Aucune mise à jour effectuée" }, { status: 400 });
    }
  } catch (err) {
    console.error("Erreur lors de la mise à jour:", err);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
}

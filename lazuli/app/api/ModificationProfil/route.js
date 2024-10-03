// /app/api/ModificationProfil/route.js

import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Désactiver l'analyseur de corps par défaut
  },
};

const uri = process.env.MONGODB_URI; // Assurez-vous que cette variable d'environnement est définie
const client = new MongoClient(uri);
let db;

async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db("lazulibd"); 
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    await connectToDatabase();

    const user = await db.collection('utilisateur').findOne({ _id: new ObjectId(userId) });

    if (user) {
      console.log("Fetched user data: ", user);
      return NextResponse.json({
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
        profilePic: user.profilePic,
      });
    } else {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du profil:", err);
    return NextResponse.json({ error: "Une erreur s'est produite lors de la récupération du profil" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();

    const form = formidable({ multiples: false });

    // Convertir la requête en flux pour formidable
    const reqBody = await req.blob();
    const buffer = Buffer.from(await reqBody.arrayBuffer());

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(buffer, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const { userId, name, email, birthDate } = fields;

    let profilePicUrl = null;

    if (files.profilePic) {
      const file = files.profilePic;

      // Valider le type de fichier
      if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
        return NextResponse.json({ error: "Type de fichier non supporté" }, { status: 400 });
      }

      // Créer le dossier 'public/uploads' s'il n'existe pas
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${userId}_${Date.now()}_${file.originalFilename}`;
      const uploadPath = path.join(uploadDir, fileName);

      // Lire le fichier depuis le chemin temporaire
      const data = await fs.readFile(file.filepath);

      // Écrire le fichier dans le dossier 'uploads'
      await fs.writeFile(uploadPath, data);

      profilePicUrl = `/uploads/${fileName}`;
    }

    const users = db.collection('utilisateur');
    const updateFields = {
      name,
      email,
      birthDate,
    };

    if (profilePicUrl) {
      updateFields.profilePic = profilePicUrl;
    }

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
    return NextResponse.json({ error: "Une erreur s'est produite lors de la mise à jour du profil" }, { status: 500 });
  }
}
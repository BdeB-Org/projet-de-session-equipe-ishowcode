import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { join } from 'path';
import { promises as fs } from 'fs';

const uri = process.env.MONGODB_URI; // Assurez-vous que cette variable d'environnement est définie
const client = new MongoClient(uri);
let db;

async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db("lazulibd");
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
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

export async function POST(request) {
  try {
    await connectToDatabase();

    const formData = await request.formData();

    const userId = formData.get('userId');
    const name = formData.get('name');
    const email = formData.get('email');
    const birthDate = formData.get('birthDate');

    const profilePic = formData.get('profilePic'); // C'est un objet File ou null

    let profilePicUrl = null;

    if (profilePic && profilePic.size > 0) {
      // Valider le type de fichier
      if (!['image/jpeg', 'image/png'].includes(profilePic.type)) {
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
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
}
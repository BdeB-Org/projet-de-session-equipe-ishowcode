import { NextResponse } from 'next/server';
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

// Assurez-vous que MONGODB_URI est défini dans vos variables d'environnement
const uri = process.env.MONGODB_URI;

export async function POST(req) {
  try {
    // Récupérer les données du corps de la requête
    const { name, email, password } = await req.json();
    console.log("Données reçues du formulaire:", { name, email }); 

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Connexion à la base de données
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connexion à MongoDB réussie.");

    const db = client.db("lazulibd");
    const users = db.collection("utilisateur");

    // Vérifier si l'utilisateur avec le même email existe déjà
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 400 });
    }

    // Définir le chemin de l'image par défaut
    const defaultProfilePic = '/public/images/default-avatar.png';

    // Ajouter l'utilisateur dans la base de données avec la photo de profil par défaut
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      profilePic: defaultProfilePic,
    });
    console.log("Utilisateur ajouté avec succès:", result.insertedId); 

    // Retourner le message que l'utilisateur a été ajouté
    return NextResponse.json({ message: "Utilisateur créé avec succès", userId: result.insertedId }, { status: 201 });
  } catch (err) {
    console.error("Erreur dans l'API d'inscription:", err);
    return NextResponse.json({ error: "Une erreur est survenue lors de l'enregistrement de l'utilisateur" }, { status: 500 });
  }
}

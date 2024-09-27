import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

const uri = "mongodb+srv://Cluster81130:helloworld@cluster81130.nv3ke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster81130";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    console.log("Données reçues du formulaire:", { name, email }); 

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connexion à MongoDB réussie.");

    const db = client.db("lazulibd");
    const users = db.collection("utilisateur");

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 400 });
    }

    const result = await users.insertOne({ name, email, password: hashedPassword });
    console.log("Utilisateur ajouté avec succès:", result.insertedId); 

    return NextResponse.json({ message: "Utilisateur créé avec succès", userId: result.insertedId }, { status: 201 });
  } catch (err) {
    console.error("Erreur dans l'API d'inscription:", err);
    return NextResponse.json({ error: "Une erreur est survenue lors de l'enregistrement de l'utilisateur" }, { status: 500 });
  }
}
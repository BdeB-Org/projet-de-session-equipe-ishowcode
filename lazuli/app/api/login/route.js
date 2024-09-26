import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt';

const uri = process.env.MONGODB_URI;

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("lazulibd");
    const users = db.collection("utilisateur");

    const user = await users.findOne({ email: email, password: password });
    //verifie l'utlisateur 
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        return NextResponse.json({ message: "Connexion réussie", userId: user._id });
      } else {
        return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
    }
  } catch (err) {
    console.error("Erreur lors de la connexion:", err);
    return NextResponse.json({ error: "Une erreur est survenue lors de la connexion" }, { status: 500 });
  }
}
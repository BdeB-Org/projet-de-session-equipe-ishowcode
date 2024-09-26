import { MongoClient } from "mongodb";
import { NextResponse } from 'next/server';

const uri = "mongodb+srv://Cluster81130:helloworld@cluster81130.nv3ke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster81130";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db("lazulibd");
    const users = db.collection("utilisateur");

    const user = await users.findOne({ email: email, password: password });

    if (user) {
      return NextResponse.json({ message: "Connexion réussie", userId: user._id });
    } else {
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
    }
  } catch (err) {
    console.error("Erreur lors de la connexion:", err);
    return NextResponse.json({ error: "Une erreur est survenue lors de la connexion" }, { status: 500 });
  }
}

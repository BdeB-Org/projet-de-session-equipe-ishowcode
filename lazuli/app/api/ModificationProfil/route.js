import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = "mongodb+srv://Cluster81130:helloworld@cluster81130.nv3ke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster81130";
const client = new MongoClient(uri);
let db;

async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db("lazulibd"); 
  }
}

export async function POST(req) {
  try {
    const { userId, name, email, birthDate, profilePic } = await req.json();
    await connectToDatabase();

    const users = db.collection('utilisateur'); 
    const updatedUser = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { name, email, birthDate, profilePic } }
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
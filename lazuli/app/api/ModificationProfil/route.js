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

// GET request to fetch user profile data
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    await connectToDatabase();

    const user = await db.collection('utilisateur').findOne({ _id: new ObjectId(userId) });

    if (user) {
      console.log("Fetched user data: ", user); // Debug log to check the fetched data
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

// POST request to update user profile data
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
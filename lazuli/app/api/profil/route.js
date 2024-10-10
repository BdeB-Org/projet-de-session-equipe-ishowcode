import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from 'next/server';

const uri = "mongodb+srv://Cluster81130:helloworld@cluster81130.nv3ke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster81130";
// route pour le profil, ici on a une fonction delete 
export async function DELETE(req) {
  try {
    const { userId } = await req.json();
    console.log("Request to delete user:", { userId });

    if (!ObjectId.isValid(userId)) {
      return new Response(JSON.stringify({ error: "Invalid user ID format." }), { status: 400 });
    }

    const client = new MongoClient(uri);
    //Connecte a MongoDB
    await client.connect(); 
    console.log("Successfully connected to MongoDB.");
    const db = client.db("lazulibd");
    const users = db.collection("utilisateur");
    //Supprime l'utilsateur  
    const result = await users.deleteOne({ _id: new ObjectId(userId) });
    //Verifie si l'utilisateur a été supprimé
    if (result.deletedCount === 1) {
      console.log("User deleted successfully.");
      return new Response(JSON.stringify({ message: "Compte utilisateur supprimé avec succès." }), { status: 200 });
    } else {
      console.error("User not found.");
      return new Response(JSON.stringify({ error: "User not found." }), { status: 404 });
    }
  }catch (err) {
    console.error("Error in the delete account API:", err);
    return new Response(JSON.stringify({ error: "An error occurred while deleting the user account." }), { status: 500 });
  }
}

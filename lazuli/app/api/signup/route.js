import { MongoClient } from "mongodb";

const uri = "mongodb+srv://Cluster81130:helloworld@cluster81130.nv3ke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster81130";
// route pour le profil, ici on a une fonction qui crée l'utilisateur
export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    console.log("Données reçues du formulaire:", { name, email, password }); 

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    await client.connect();
    console.log("Connexion à MongoDB réussie.");

    const db = client.db("lazulibd");
    const users = db.collection("utilisateur");

    const result = await users.insertOne({ name, email, password });
    console.log("Utilisateur ajouté avec succès:", result); 

    return new Response(JSON.stringify({ message: "Utilisateur créé avec succès", userId: result.insertedId }), { status: 201 });
  } catch (err) {
    console.error("Erreur dans l'API d'inscription:", err);
    return new Response(JSON.stringify({ error: "Une erreur est survenue lors de l'enregistrement de l'utilisateur" }), { status: 500 });
  }
}

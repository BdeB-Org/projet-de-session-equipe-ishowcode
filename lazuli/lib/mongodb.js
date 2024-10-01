import { MongoClient } from "mongodb";

const uri = "mongodb+srv://Cluster81130:helloworld@cluster81130.nv3ke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster81130";
let client;
let db;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("lazulibd");
  }
  return { client, db };
}

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectToDatabase first.");
  }
  return db;
}
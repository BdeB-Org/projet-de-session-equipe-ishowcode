import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = "mongodb+srv://Cluster81130:helloworld@cluster81130.nv3ke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster81130";

export async function POST(req) {
  const { userId, newBalance } = await req.json();

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("lazulibd");
    const users = db.collection("utilisateur");

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { balance: newBalance } }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ message: "Balance updated successfully." }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to update balance." }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating balance:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

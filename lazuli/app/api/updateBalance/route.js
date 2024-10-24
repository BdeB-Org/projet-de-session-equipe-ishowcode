import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = "mongodb+srv://Cluster81130:helloworld@cluster81130.nv3ke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster81130";

export async function POST(req) {
  const { userId, newBalance } = await req.json();

  try {
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
    }
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("lazulibd");
    const users = db.collection("utilisateur");
    const balanceHistory = db.collection("balanceHistory"); 

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { balance: newBalance } }
    );

    const historyEntry = {
      userId: new ObjectId(userId),
      balance: newBalance,
      date: new Date(),
    };

    await balanceHistory.insertOne(historyEntry);

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

export async function GET(req) {
  const { userId } = req.query;

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("lazulibd");
    const balanceHistory = db.collection("balanceHistory");

    const history = await balanceHistory.find({ userId: new ObjectId(userId) }).toArray();

    if (history.length === 0) {
      return NextResponse.json({ message: "Pas de changement à date." }, { status: 200 });
    }

    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    console.error("Error fetching balance history:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

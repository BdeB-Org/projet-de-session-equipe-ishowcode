import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('lazulibd');
  cachedDb = db;
  return db;
}

export async function GET(req) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId || !ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "Invalid or missing user ID" }, { status: 400 });
  }

  try {
    const db = await connectToDatabase();
    const users = db.collection('utilisateur');
    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ balance: user.balance || 0 }, { status: 200 });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

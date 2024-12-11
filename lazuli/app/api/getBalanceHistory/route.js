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
    const balanceHistory = db.collection('balanceHistory');

    const historyData = await balanceHistory.find({ userId: new ObjectId(userId) }).sort({ date: 1 }).toArray();
    return NextResponse.json({ history: historyData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching balance history:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

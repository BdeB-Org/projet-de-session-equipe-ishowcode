import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }
  const client = new MongoClient(uri);
  await client.connect();
  return client.db();
}

export async function POST(req) {
  try {
    const { userId, type, crypto, amount, value, date } = await req.json();

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('utilisateur');
    const transactionsCollection = db.collection('transactions');

    // Change find to findOne
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      console.error('User not found for userId:', userId);
      return NextResponse.json({ message: 'User not found' }, { status: 404 ,  details: error.message });
    }

    let updatedBalance;

    if (type === 'buy') {
      if (user.balance < value) {
        return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
      }
      updatedBalance = user.balance - value;
    } else if (type === 'sell') {
      updatedBalance = user.balance + value;
    } else {
      return NextResponse.json({ message: 'Invalid transaction type' }, { status: 400 });
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { balance: updatedBalance } }
    );

    try {
      await transactionsCollection.insertOne({
        userId: new ObjectId(userId),
        transactionType: type,        
        selectedCrypto: crypto,      
        amount: amount,
        transactionValue: value,
        date: new Date(date),         
      });
      console.log("Transaction inserted successfully");
    } catch (error) {
      return NextResponse.json({ message: 'Cant access database', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ balance: updatedBalance }, { status: 200 });
  } catch (error) {
    console.error('Error processing transaction:', error.message, error.stack);
    return NextResponse.json({ message: 'Internal server error', details: error.message }, { status: 500 });
  }
}

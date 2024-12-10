import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }
  const client = new MongoClient(uri);
  await client.connect();

  const dbName = 'lazulibd'; 
  const db = client.db(dbName);
  return db;
}

export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid or missing user ID" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const transactionsCollection = db.collection('transactions');

    const transactions = await transactionsCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching transaction history:', error.message, error.stack);
    return NextResponse.json({ message: 'Internal server error', details: error.message }, { status: 500 });
  }
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

    // Recherche de l'utilisateur dans la base de données avec l'ID fourni.
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      console.error('User not found for userId:', userId);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Conversion des valeurs en nombres
    const numericValue = Number(value);
    const numericAmount = Number(amount);
    const userBalance = Number(user.balance);

    let updatedBalance;
    let updatedPortfolio = user.portfolio || {};

    // Vérification du type de transaction et mise à jour du solde et du portefeuille
    if (type === 'buy') {
      if (userBalance < numericValue) {
        return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
      }
      updatedBalance = userBalance - numericValue;
      updatedPortfolio[crypto] = (updatedPortfolio[crypto] || 0) + numericAmount;
    } else if (type === 'sell') {
      if (!updatedPortfolio[crypto] || updatedPortfolio[crypto] < numericAmount) {
        return NextResponse.json({ message: 'Insufficient crypto balance' }, { status: 400 });
      }
      updatedBalance = userBalance + numericValue;
      updatedPortfolio[crypto] -= numericAmount;
      if (updatedPortfolio[crypto] <= 0) {
        delete updatedPortfolio[crypto];
      }
    } else {
      return NextResponse.json({ message: 'Invalid transaction type' }, { status: 400 });
    }

    // Mise à jour du solde et du portefeuille de l'utilisateur dans la base de données.
    const updateResult = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { balance: updatedBalance, portfolio: updatedPortfolio } }
    );

    if (updateResult.modifiedCount === 0) {
      console.error('Failed to update user data for userId:', userId);
      return NextResponse.json({ message: 'Failed to update user data' }, { status: 500 });
    }

    // Insertion de la transaction dans la collection des transactions.
    await transactionsCollection.insertOne({
      userId: new ObjectId(userId),
      transactionType: type,
      selectedCrypto: crypto,
      amount: numericAmount,
      transactionValue: numericValue,
      date: new Date(date),
    });
    console.log("Transaction inserted successfully");

    return NextResponse.json({ balance: updatedBalance, portfolio: updatedPortfolio }, { status: 200 });
  } catch (error) {
    console.error('Error processing transaction:', error.message, error.stack);
    return NextResponse.json({ message: 'Internal server error', details: error.message }, { status: 500 });
  }
}

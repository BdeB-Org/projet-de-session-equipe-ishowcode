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

export async function GET(req) {
  
  try {

    
    const { userId } = req.nextUrl.searchParams;

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid or missing user ID" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const transactionsCollection = db.collection('transactions');

          const transactions = await transactionsCollection
        .find({ userId: new ObjectId(userId) })
        .sort({ date: -1 })
        .toArray();

      // Validate data format if necessary
      if (!Array.isArray(transactions)) {
        return NextResponse.json({ error: "Invalid data format for transactions" }, { status: 500 });
      }

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
    // Si l'utilisateur n'est pas trouvé, renvoyer une réponse message d'erreur.
    if (!user) {
      console.error('User not found for userId:', userId);
      return NextResponse.json({ message: 'User not found' }, { status: 404 ,  details: error.message });
    }

    let updatedBalance;
    // Vérification qu'il a un solde suffisant pour l'achat
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
     // Mise à jour du solde de l'utilisateur dans la base de données.
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { balance: updatedBalance } }
    );

    try {
      // Insertion de la transaction dans la collection des transactions.
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

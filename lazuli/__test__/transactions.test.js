const { GET, POST } = require('../pages/api/transactions');
const { MongoClient, ObjectId } = require('mongodb');
const { NextRequest } = require('next/server');
const { NextResponse } = require('next/server');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('API des Transactions', () => {
  let mongoServer;
  let client;
  let db;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('lazulibd');
    process.env.MONGODB_URI = uri;

    // Initialisation de la base de données avec un utilisateur
    await db.collection('utilisateur').insertOne({
      _id: new ObjectId('64b7e5f8f1a4c8b5d6e7f8g9'),
      balance: 1000,
      portfolio: {
        BTC: 2,
      },
      profilePic: '/images/default-avatar.png',
    });
  });

  afterAll(async () => {
    await client.close();
    await mongoServer.stop();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/transactions', () => {
    it("devrait retourner 400 si l'ID utilisateur est manquant", async () => {
      const req = new NextRequest('http://localhost/api/transactions');
      await GET(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "ID utilisateur invalide ou manquant" },
        { status: 400 }
      );
    });

    it("devrait retourner 400 si l'ID utilisateur est invalide", async () => {
      const req = new NextRequest('http://localhost/api/transactions?userId=invalid');
      await GET(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "ID utilisateur invalide ou manquant" },
        { status: 400 }
      );
    });

    it("devrait retourner les transactions pour un ID utilisateur valide", async () => {
      // Insérer une transaction pour l'utilisateur
      const transactions = db.collection('transactions');
      const userId = '64b7e5f8f1a4c8b5d6e7f8g9';
      await transactions.insertOne({
        userId: new ObjectId(userId),
        transactionType: 'buy',
        selectedCrypto: 'BTC',
        amount: 1,
        transactionValue: 500,
        date: new Date(),
      });

      const req = new NextRequest(`http://localhost/api/transactions?userId=${userId}`);
      await GET(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          transactions: [
            expect.objectContaining({
              transactionType: 'buy',
              selectedCrypto: 'BTC',
              amount: 1,
              transactionValue: 500,
            }),
          ],
        },
        { status: 200 }
      );
    });

    it("devrait gérer les erreurs serveur correctement", async () => {
      jest.spyOn(global, 'MongoClient').mockImplementationOnce(() => {
        throw new Error("Échec de la connexion à la base de données");
      });

      const req = new NextRequest('http://localhost/api/transactions?userId=64b7e5f8f1a4c8b5d6e7f8g9');
      await GET(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Erreur interne du serveur", details: "Échec de la connexion à la base de données" },
        { status: 500 }
      );
    });
  });

  describe('POST /api/transactions', () => {
    it("devrait retourner 400 si l'ID utilisateur est invalide", async () => {
      const req = new NextRequest('http://localhost/api/transactions', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'invalid',
          type: 'buy',
          crypto: 'BTC',
          amount: 1,
          value: 500,
          date: new Date().toISOString(),
        }),
      });

      await POST(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "ID utilisateur invalide." },
        { status: 400 }
      );
    });

    it("devrait retourner 404 si l'utilisateur est introuvable", async () => {
      const req = new NextRequest('http://localhost/api/transactions', {
        method: 'POST',
        body: JSON.stringify({
          userId: '64b7e5f8f1a4c8b5d6e7f8g0',
          type: 'buy',
          crypto: 'BTC',
          amount: 1,
          value: 500,
          date: new Date().toISOString(),
        }),
      });

      await POST(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Utilisateur introuvable" },
        { status: 404 }
      );
    });

    it("devrait retourner 400 pour solde insuffisant lors d'un achat", async () => {
      const req = new NextRequest('http://localhost/api/transactions', {
        method: 'POST',
        body: JSON.stringify({
          userId: '64b7e5f8f1a4c8b5d6e7f8g9',
          type: 'buy',
          crypto: 'BTC',
          amount: 3,
          value: 1500,
          date: new Date().toISOString(),
        }),
      });

      await POST(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Solde insuffisant" },
        { status: 400 }
      );
    });

    it("devrait retourner 400 pour crypto insuffisante lors d'une vente", async () => {
      const req = new NextRequest('http://localhost/api/transactions', {
        method: 'POST',
        body: JSON.stringify({
          userId: '64b7e5f8f1a4c8b5d6e7f8g9',
          type: 'sell',
          crypto: 'BTC',
          amount: 3,
          value: 1500,
          date: new Date().toISOString(),
        }),
      });

      await POST(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Solde de crypto insuffisant" },
        { status: 400 }
      );
    });

    it("devrait traiter une transaction d'achat valide", async () => {
      const req = new NextRequest('http://localhost/api/transactions', {
        method: 'POST',
        body: JSON.stringify({
          userId: '64b7e5f8f1a4c8b5d6e7f8g9',
          type: 'buy',
          crypto: 'ETH',
          amount: 5,
          value: 500,
          date: new Date().toISOString(),
        }),
      });

      await POST(req);

      const user = await db.collection('utilisateur').findOne({ _id: new ObjectId('64b7e5f8f1a4c8b5d6e7f8g9') });
      expect(user.balance).toBe(500);
      expect(user.portfolio.ETH).toBe(5);

      const transaction = await db.collection('transactions').findOne({ userId: new ObjectId('64b7e5f8f1a4c8b5d6e7f8g9') });
      expect(transaction).toMatchObject({
        transactionType: 'buy',
        selectedCrypto: 'ETH',
        amount: 5,
        transactionValue: 500,
      });

      expect(NextResponse.json).toHaveBeenCalledWith(
        { balance: 500, portfolio: { BTC: 2, ETH: 5 } },
        { status: 200 }
      );
    });

    it("devrait traiter une transaction de vente valide", async () => {
      const req = new NextRequest('http://localhost/api/transactions', {
        method: 'POST',
        body: JSON.stringify({
          userId: '64b7e5f8f1a4c8b5d6e7f8g9',
          type: 'sell',
          crypto: 'BTC',
          amount: 1,
          value: 500,
          date: new Date().toISOString(),
        }),
      });

      await POST(req);

      const user = await db.collection('utilisateur').findOne({ _id: new ObjectId('64b7e5f8f1a4c8b5d6e7f8g9') });
      expect(user.balance).toBe(1000);
      expect(user.portfolio.BTC).toBe(1);

      const transaction = await db.collection('transactions').findOne({ userId: new ObjectId('64b7e5f8f1a4c8b5d6e7f8g9') });
      expect(transaction).toMatchObject({
        transactionType: 'sell',
        selectedCrypto: 'BTC',
        amount: 1,
        transactionValue: 500,
      });

      expect(NextResponse.json).toHaveBeenCalledWith(
        { balance: 1000, portfolio: { BTC: 1, ETH: 5 } },
        { status: 200 }
      );
    });

    it("devrait supprimer la crypto du portefeuille si le montant devient nul ou inférieur", async () => {
      const req = new NextRequest('http://localhost/api/transactions', {
        method: 'POST',
        body: JSON.stringify({
          userId: '64b7e5f8f1a4c8b5d6e7f8g9',
          type: 'sell',
          crypto: 'BTC',
          amount: 1,
          value: 500,
          date: new Date().toISOString(),
        }),
      });

      await POST(req);

      await POST(req);

      const user = await db.collection('utilisateur').findOne({ _id: new ObjectId('64b7e5f8f1a4c8b5d6e7f8g9') });
      expect(user.portfolio.BTC).toBeUndefined();
    });

    it("devrait retourner 400 pour un type de transaction invalide", async () => {
      const req = new NextRequest('http://localhost/api/transactions', {
        method: 'POST',
        body: JSON.stringify({
          userId: '64b7e5f8f1a4c8b5d6e7f8g9',
          type: 'invalid_type',
          crypto: 'BTC',
          amount: 1,
          value: 500,
          date: new Date().toISOString(),
        }),
      });

      await POST(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Type de transaction invalide" },
        { status: 400 }
      );
    });

    it("devrait gérer les erreurs serveur correctement", async () => {
      jest.spyOn(global, 'MongoClient').mockImplementationOnce(() => {
        throw new Error("Échec de la connexion à la base de données");
      });

      const req = new NextRequest('http://localhost/api/transactions', {
        method: 'POST',
        body: JSON.stringify({
          userId: '64b7e5f8f1a4c8b5d6e7f8g9',
          type: 'buy',
          crypto: 'BTC',
          amount: 1,
          value: 500,
          date: new Date().toISOString(),
        }),
      });

      await POST(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Erreur interne du serveur", details: "Échec de la connexion à la base de données" },
        { status: 500 }
      );
    });
  });
});

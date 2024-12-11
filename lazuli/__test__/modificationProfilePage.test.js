const { GET, POST } = require('../../app/api/ModificationProfil/route');
const { MongoClient, ObjectId } = require('mongodb');
const { NextRequest } = require('next/server');
const { NextResponse } = require('next/server');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const axios = require('axios');

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('API de ModificationProfil', () => {
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
    process.env.EXCHANGE_RATE_API_KEY = 'test_api_key';

    // Initialisation de la base de données avec un utilisateur
    const hashedPassword = await bcrypt.hash('OldPassword1!', 10);
    await db.collection('utilisateur').insertOne({
      _id: new ObjectId('64b7e5f8f1a4c8b5d6e7f8g9'),
      name: 'John Doe',
      email: 'john@example.com',
      balance: 1000,
      birthDate: '1990-01-01',
      profilePic: '/uploads/default-avatar.png',
      currency: 'CAD',
      password: hashedPassword,
      portfolio: {
        BTC: 2,
      },
    });
  });

  afterAll(async () => {
    await client.close();
    await mongoServer.stop();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/ModificationProfil', () => {
    it("devrait retourner 400 si l'ID utilisateur est manquant", async () => {
      const req = new NextRequest('http://localhost/api/ModificationProfil');
      await GET(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    });

    it("devrait retourner 404 si l'utilisateur est introuvable", async () => {
      const req = new NextRequest(
        'http://localhost/api/ModificationProfil?userId=64b7e5f8f1a4c8b5d6e7f8g0'
      );
      await GET(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    });

    it("devrait retourner le profil utilisateur pour un ID utilisateur valide", async () => {
      const userId = '64b7e5f8f1a4c8b5d6e7f8g9';
      const req = new NextRequest(
        `http://localhost/api/ModificationProfil?userId=${userId}`
      );
      await GET(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          name: 'John Doe',
          email: 'john@example.com',
          balance: 1000,
          birthDate: '1990-01-01',
          profilePic: '/uploads/default-avatar.png',
          currency: 'CAD',
        },
        { status: 200 }
      );
    });

    it("devrait gérer les erreurs serveur correctement", async () => {
      jest.spyOn(MongoClient.prototype, 'connect').mockImplementationOnce(() => {
        throw new Error('Échec de la connexion à la base de données');
      });

      const req = new NextRequest(
        'http://localhost/api/ModificationProfil?userId=64b7e5f8f1a4c8b5d6e7f8g9'
      );
      await GET(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Une erreur s'est produite lors de la récupération du profil" },
        { status: 500 }
      );
    });
  });

  describe('POST /api/ModificationProfil', () => {
    it("devrait retourner 404 si l'utilisateur est introuvable", async () => {
      const formData = new FormData();
      formData.append('userId', '64b7e5f8f1a4c8b5d6e7f8g0');
      formData.append('name', 'Jane Doe');
      formData.append('email', 'jane@example.com');
      formData.append('birthDate', '1992-02-02');
      formData.append('currency', 'USD');

      const req = new NextRequest('http://localhost/api/ModificationProfil', {
        method: 'POST',
        body: formData,
      });

      await POST(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Utilisateur non trouvé.' },
        { status: 404 }
      );
    });

    it("devrait mettre à jour le profil sans changement de devise et sans changement de mot de passe", async () => {
      const formData = new FormData();
      formData.append('userId', '64b7e5f8f1a4c8b5d6e7f8g9');
      formData.append('name', 'John Updated');
      formData.append('email', 'john.updated@example.com');
      formData.append('birthDate', '1990-01-01');
      formData.append('currency', 'CAD');

      const req = new NextRequest('http://localhost/api/ModificationProfil', {
        method: 'POST',
        body: formData,
      });

      await POST(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: 'Profil mis à jour avec succès' },
        { status: 200 }
      );

      const updatedUser = await db
        .collection('utilisateur')
        .findOne({ _id: new ObjectId('64b7e5f8f1a4c8b5d6e7f8g9') });

      expect(updatedUser.name).toBe('John Updated');
      expect(updatedUser.email).toBe('john.updated@example.com');
      expect(updatedUser.currency).toBe('CAD');
      expect(updatedUser.balance).toBe(1000);
    });

    it("devrait mettre à jour le profil avec un changement de devise", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          result: 'success',
          conversion_rates: {
            USD: 0.8,
          },
        },
      });

      const formData = new FormData();
      formData.append('userId', '64b7e5f8f1a4c8b5d6e7f8g9');
      formData.append('name', 'John USD');
      formData.append('email', 'john.usd@example.com');
      formData.append('birthDate', '1990-01-01');
      formData.append('currency', 'USD');

      const req = new NextRequest('http://localhost/api/ModificationProfil', {
        method: 'POST',
        body: formData,
      });

      await POST(req);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://v6.exchangerate-api.com/v6/test_api_key/latest/CAD'
      );

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: 'Profil mis à jour avec succès' },
        { status: 200 }
      );

      const updatedUser = await db
        .collection('utilisateur')
        .findOne({ _id: new ObjectId('64b7e5f8f1a4c8b5d6e7f8g9') });

      expect(updatedUser.currency).toBe('USD');
      expect(updatedUser.balance).toBe(800);
    });

    it("devrait gérer l'échec de la conversion de devise", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          result: 'error',
          'error-type': 'invalid-key',
        },
      });

      const formData = new FormData();
      formData.append('userId', '64b7e5f8f1a4c8b5d6e7f8g9');
      formData.append('name', 'John USD');
      formData.append('email', 'john.usd@example.com');
      formData.append('birthDate', '1990-01-01');
      formData.append('currency', 'USD');

      const req = new NextRequest('http://localhost/api/ModificationProfil', {
        method: 'POST',
        body: formData,
      });

      await POST(req);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://v6.exchangerate-api.com/v6/test_api_key/latest/CAD'
      );

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Erreur lors de la conversion du solde.' },
        { status: 500 }
      );

      const updatedUser = await db
        .collection('utilisateur')
        .findOne({ _id: new ObjectId('64b7e5f8f1a4c8b5d6e7f8g9') });

      expect(updatedUser.currency).toBe('CAD');
      expect(updatedUser.balance).toBe(1000);
    });

    it("devrait mettre à jour le profil avec un changement de mot de passe", async () => {
      const formData = new FormData();
      formData.append('userId', '64b7e5f8f1a4c8b5d6e7f8g9');
      formData.append('name', 'John Password');
      formData.append('email', 'john.password@example.com');
      formData.append('birthDate', '1990-01-01');
      formData.append('currency', 'CAD');
      formData.append('oldPassword', 'OldPassword1!');
      formData.append('newPassword', 'NewPassword1!');

      const req = new NextRequest('http://localhost/api/ModificationProfil', {
        method: 'POST',
        body: formData,
      });

      await POST(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: 'Profil mis à jour avec succès' },
        { status: 200 }
      );

      const updatedUser = await db
        .collection('utilisateur')
        .findOne({ _id: new ObjectId('64b7e5f8f1a4c8b5d6e7f8g9') });

      const isPasswordUpdated = await bcrypt.compare(
        'NewPassword1!',
        updatedUser.password
      );
      expect(isPasswordUpdated).toBe(true);
    });

    it("devrait retourner 400 si l'ancien mot de passe est incorrect", async () => {
      const formData = new FormData();
      formData.append('userId', '64b7e5f8f1a4c8b5d6e7f8g9');
      formData.append('name', 'John Password');
      formData.append('email', 'john.password@example.com');
      formData.append('birthDate', '1990-01-01');
      formData.append('currency', 'CAD');
      formData.append('oldPassword', 'WrongPassword!');
      formData.append('newPassword', 'NewPassword1!');

      const req = new NextRequest('http://localhost/api/ModificationProfil', {
        method: 'POST',
        body: formData,
      });

      await POST(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "L'ancien mot de passe est incorrect." },
        { status: 400 }
      );
    });

    it("devrait retourner 400 si le nouveau mot de passe ne respecte pas les exigences", async () => {
      const formData = new FormData();
      formData.append('userId', '64b7e5f8f1a4c8b5d6e7f8g9');
      formData.append('name', 'John Password');
      formData.append('email', 'john.password@example.com');
      formData.append('birthDate', '1990-01-01');
      formData.append('currency', 'CAD');
      formData.append('oldPassword', 'OldPassword1!');
      formData.append('newPassword', 'short');

      const req = new NextRequest('http://localhost/api/ModificationProfil', {
        method: 'POST',
        body: formData,
      });

      await POST(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          error:
            'Le nouveau mot de passe doit comporter au moins 8 caractères, inclure au moins une lettre majuscule et un caractère spécial.',
        },
        { status: 400 }
      );
    });

    it("devrait gérer le téléchargement de la photo de profil", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          result: 'success',
          conversion_rates: {},
        },
      });

      const mockFile = new File(['dummy content'], 'avatar.png', {
        type: 'image/png',
      });

      const formData = new FormData();
      formData.append('userId', '64b7e5f8f1a4c8b5d6e7f8g9');
      formData.append('name', 'John Pic');
      formData.append('email', 'john.pic@example.com');
      formData.append('birthDate', '1990-01-01');
      formData.append('currency', 'CAD');
      formData.append('profilePic', mockFile);

      const req = new NextRequest('http://localhost/api/ModificationProfil', {
        method: 'POST',
        body: formData,
      });

      const fs = require('fs').promises;
      jest.spyOn(fs, 'mkdir').mockResolvedValue();
      jest.spyOn(fs, 'writeFile').mockResolvedValue();

      await POST(req);

      expect(fs.mkdir).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: 'Profil mis à jour avec succès' },
        { status: 200 }
      );

      const updatedUser = await db
        .collection('utilisateur')
        .findOne({ _id: new ObjectId('64b7e5f8f1a4c8b5d6e7f8g9') });

      expect(updatedUser.profilePic).toMatch(/\/uploads\/64b7e5f8f1a4c8b5d6e7f8g9_\d+_avatar.png/);
    });

    it("devrait retourner 400 pour un type de fichier non supporté", async () => {
      const mockFile = new File(['dummy content'], 'avatar.txt', {
        type: 'text/plain',
      });

      const formData = new FormData();
      formData.append('userId', '64b7e5f8f1a4c8b5d6e7f8g9');
      formData.append('name', 'John Pic');
      formData.append('email', 'john.pic@example.com');
      formData.append('birthDate', '1990-01-01');
      formData.append('currency', 'CAD');
      formData.append('profilePic', mockFile);

      const req = new NextRequest('http://localhost/api/ModificationProfil', {
        method: 'POST',
        body: formData,
      });

      await POST(req);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'Type de fichier non supporté' },
        { status: 400 }
      );
    });

    it("devrait retourner 400 si aucune mise à jour n'est effectuée", async () => {
        const formData = new FormData();
        formData.append('userId', '64b7e5f8f1a4c8b5d6e7f8g9');
        // Aucun champ mis à jour
  
        const req = new NextRequest('http://localhost/api/ModificationProfil', {
          method: 'POST',
          body: formData,
        });
  
        await POST(req);
  
        expect(NextResponse.json).toHaveBeenCalledWith(
          { error: 'Aucune mise à jour effectuée' },
          { status: 400 }
        );
      });
  
      it("devrait gérer les erreurs serveur correctement", async () => {
        jest.spyOn(MongoClient.prototype, 'connect').mockImplementationOnce(() => {
          throw new Error('Échec de la connexion à la base de données');
        });
  
        const formData = new FormData();
        formData.append('userId', '64b7e5f8f1a4c8b5d6e7f8g9');
        formData.append('name', 'John Doe');
        formData.append('email', 'john@example.com');
        formData.append('birthDate', '1990-01-01');
        formData.append('currency', 'CAD');
  
        const req = new NextRequest('http://localhost/api/ModificationProfil', {
          method: 'POST',
          body: formData,
        });
  
        await POST(req);
  
        expect(NextResponse.json).toHaveBeenCalledWith(
          { error: "Une erreur s'est produite lors de la mise à jour du profil" },
          { status: 500 }
        );
      });
    });
  });
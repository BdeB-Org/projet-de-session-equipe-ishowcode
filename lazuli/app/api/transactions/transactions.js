import dbConnect from '@/utils/dbConnect'; 
import Transaction from '@/models/Transaction'; 
import calculateReceivedAmount from '@/utils/calculateReceivedAmount'; 

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { type, crypto, amount, cost } = req.body;

    try {
      if (!type || !crypto || !amount) {
        return res.status(400).json({ error: 'Type, crypto et amount sont requis' });
      }

      if (type === 'buy') {
        const transaction = new Transaction({
          type,
          crypto,
          amount,
          cost,
          userId: req.userId, 
        });
        await transaction.save();
        return res.status(200).json({ message: 'Transaction d\'achat enregistrée' });

      } else if (type === 'sell') {
        const transaction = new Transaction({
          type,
          crypto,
          amount,
          userId: req.userId,
        });
        await transaction.save();

        const receivedAmount = calculateReceivedAmount(crypto, amount); 
        return res.status(200).json({ message: 'Transaction de vente enregistrée', receivedAmount });

      } else {
        return res.status(400).json({ error: 'Type de transaction invalide' });
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la transaction:', error);
      return res.status(500).json({ error: 'Erreur interne du serveur' });
    }

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}

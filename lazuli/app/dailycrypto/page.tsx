import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

// Interface pour les formes de données d'une cryptomonnaie
interface CryptoInfo {
  name: string;
  price: string;
  change: string;
  marketCap: number;
  volume: number;
  low24h: number;
  high24h: number;
  circulatingSupply: number;
  totalSupply: number;
}
//Interface pour les propriétés de CryptoOfTheDay
interface CryptoOfTheDayProps {
  cryptoData: {
    [key: string]: CryptoInfo;
  };
}
//Fonction CryptoOfTheDay, affiche la crypto avec la plus grande hausse
const CryptoOfTheDay = ({ cryptoData }: CryptoOfTheDayProps) => {
  const getCryptoOfTheDay = () => {
    return Object.entries(cryptoData).reduce<{ id: string } & CryptoInfo | null>((highest, [key, crypto]) => {
      const change = parseFloat(crypto.change);
      if (!highest || (change > parseFloat(highest.change) && change > 0)) {
        return { ...crypto, id: key };
      }
      return highest;
    }, null);
  };
  //Obtenir la cryptomonnaie avec la plus grande hausse du jour
  const topCrypto = getCryptoOfTheDay();

  if (!topCrypto) {
    return null;
  }
  //Affichage de la cryptomonnaie avec la plus grande hausse du jour
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 p-6 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl shadow-lg"
    >
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Crypto du Jour 🏆</h3>
          <p className="text-2xl font-bold text-white mb-2">{topCrypto.name}</p>
          <p className="text-lg text-white/90">{topCrypto.price}</p>
        </div>
        
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <TrendingUp className="w-6 h-6 text-green-300" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="text-3xl font-bold text-green-300"
            >
              +{parseFloat(topCrypto.change).toFixed(2)}%
            </motion.div>
          </div>
          <p className="text-sm text-white/75 mt-1">dans les dernières 24h</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CryptoOfTheDay;
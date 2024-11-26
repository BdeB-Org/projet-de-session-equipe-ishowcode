'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface CryptoInfo {
  id: string;
  name: string;
  currentPrice: number;
  symbol: string;
}

export default function CryptoConverter() {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('usd');
  const [toCrypto, setToCrypto] = useState<string>('bitcoin');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [cryptoList, setCryptoList] = useState<CryptoInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const defaultCryptos = ['bitcoin', 'ethereum', 'cardano', 'dogecoin', 'solana'];

  const fetchCryptoPrices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
        params: {
          vs_currency: fromCurrency,
          ids: defaultCryptos.join(','),
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
        },
      });

      const formattedCryptos: CryptoInfo[] = response.data.map((crypto: any) => ({
        id: crypto.id,
        name: crypto.name,
        currentPrice: crypto.current_price,
        symbol: crypto.symbol.toUpperCase(),
      }));

      setCryptoList(formattedCryptos);
      setLoading(false);
    } catch (err) {
      setError('Échec de la récupération des prix des cryptomonnaies');
      setLoading(false);
    }
  };

  const convertCurrency = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    const selectedCrypto = cryptoList.find((crypto) => crypto.id === toCrypto);

    if (!selectedCrypto) {
      setError('Cryptomonnaie non trouvée');
      return;
    }

    const numericAmount = parseFloat(amount);
    const convertedValue = numericAmount / selectedCrypto.currentPrice;

    setConvertedAmount(convertedValue);
    setError(null);
  };

  useEffect(() => {
    fetchCryptoPrices();
  }, [fromCurrency]);

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-[#5d3fd3]">Convertisseur de Cryptomonnaies</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Montant à convertir</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Entrez le montant"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div className="mb-4 flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Monnaie d'origine</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            {['usd', 'eur', 'cad', 'gbp'].map((currency) => (
              <option key={currency} value={currency}>
                {currency.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cryptomonnaie cible</label>
          <select
            value={toCrypto}
            onChange={(e) => setToCrypto(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            {cryptoList.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={convertCurrency}
        className={`w-full px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-[#5d3fd3] hover:bg-[#4629a6]'}`}
        disabled={loading}
      >
        {loading ? 'Conversion en cours...' : 'Convertir'}
      </button>

      {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}

      {convertedAmount !== null && !error && (
        <motion.div
          className="mt-4 p-4 bg-gray-100 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-[#5d3fd3] mb-2">Résultat de la conversion</h3>
          <p className="text-gray-700">
            {amount} {fromCurrency.toUpperCase()} = {convertedAmount.toFixed(6)} {toCrypto.toUpperCase()}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

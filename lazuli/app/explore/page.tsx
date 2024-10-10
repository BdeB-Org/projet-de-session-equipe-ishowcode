'use client'

import { useState, useEffect, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js'; 
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip } from 'chart.js';
import { Button } from '@/components/ui/button';

ChartJS.register(CategoryScale, LineElement, PointElement, LinearScale, Title, Tooltip);

const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 60 } },
};

interface CryptoInfo {
  name: string;
  price: string;
  change: string;
  marketCap: number;
}

export default function ExplorePage() {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [cryptoData, setCryptoData] = useState<{ [key: string]: CryptoInfo }>({});
  const [priceHistory, setPriceHistory] = useState<{ x: string; y: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        //api de coingecko pour les données de crypto
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=cad&include_market_cap=true&include_24hr_change=true'
      );
      setCryptoData({
        bitcoin: {
          name: 'Bitcoin (BTC)',
          price: `CA$${response.data.bitcoin.cad}`,
          change: `${response.data.bitcoin.cad_24h_change.toFixed(2)}%`,
          marketCap: response.data.bitcoin.cad_market_cap
        },
        ethereum: {
          name: 'Ethereum (ETH)',
          price: `CA$${response.data.ethereum.cad}`,
          change: `${response.data.ethereum.cad_24h_change.toFixed(2)}%`,
          marketCap: response.data.ethereum.cad_market_cap
        }
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      setLoading(false);
    }
  };

  const fetchPriceHistory = async (crypto: string) => {
    // api de coingecko pour les données historiques
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=cad&days=7`
      );
      const prices = response.data.prices.map((price: any[]) => ({
        x: new Date(price[0]).toLocaleDateString(),
        y: price[1],
      }));
      setPriceHistory(prices);
    } catch (error) {
      console.error('Error fetching price history:', error);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    fetchPriceHistory(selectedCrypto);
  }, [selectedCrypto]);

  const handleCryptoSelect = (crypto: string) => {
    setSelectedCrypto(crypto);
    fetchPriceHistory(crypto);
  };

  const chartData = {
    labels: priceHistory.map(data => data.x),
    datasets: [{
      label: `${cryptoData[selectedCrypto]?.name} Price (CAD)`,
      data: priceHistory.map(data => data.y),
      borderColor: '#5d3fd3',
      backgroundColor: 'rgba(93, 63, 211, 0.2)',
      fill: true,
    }]
  };

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-[#f8f9fa] text-black"
      initial="hidden"
      animate="visible"
    >
      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6">
        {/* Sidebar */}
        <motion.aside 
          className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md"
          variants={containerVariants}
        >
          <nav className="space-y-4">
            <Button onClick={() => handleCryptoSelect('bitcoin')} className="bg-[#5d3fd3] text-white py-2 rounded hover:bg-[#4533a9]">
              Bitcoin
            </Button>
            <Button onClick={() => handleCryptoSelect('ethereum')} className="bg-[#5d3fd3] text-white py-2 rounded hover:bg-[#4533a9]">
              Ethereum
            </Button>
          </nav>
        </motion.aside>

        {/* Main */}
        <section className="flex-1 space-y-6">
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md"
            variants={containerVariants}
          >
            <h2 className="text-xl font-semibold">Cryptocurrency Prices</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <p className="text-2xl font-bold">{cryptoData[selectedCrypto]?.price}</p>
                <p className={`text-sm ${parseFloat(cryptoData[selectedCrypto]?.change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {cryptoData[selectedCrypto]?.change} (24h)
                </p>
                <p className="text-sm text-gray-500 mt-2">Market Cap: CA${cryptoData[selectedCrypto]?.marketCap}</p>
              </div>
            )}
          </motion.div>

          {/* Graph */}
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md"
            variants={containerVariants}
          >
            <h3 className="text-lg font-semibold">{cryptoData[selectedCrypto]?.name} Price Chart</h3>
            <div className="mt-4">
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </motion.div>
        </section>
      </main>
    </motion.div>
  );
}

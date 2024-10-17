// /app/Dashboard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import transactionLogoImg from '../Images/transaction_logo.webp';
import accueilLogoImg from '../Images/home_logo-removebg-preview.png';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
);

// Interface pour les informations sur les cryptomonnaies
interface CryptoInfo {
  name: string;
  price: string;
  change: string;
  marketCap: number;
  volume: number;
  low24h: number;
  high24h: number;
}

// Interface pour les données de prix dans le graphique
interface PriceData {
  x: string;
  y: number;
}

export default function DashboardPage() {
  const [showExplore, setShowExplore] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [cryptoData, setCryptoData] = useState<{ [key: string]: CryptoInfo }>(
    {}
  );
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState(172.03);
  const [profilePic, setProfilePic] = useState('/images/default-avatar.png'); // Chemin mis à jour

  const router = useRouter();

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    router.push('/');
  };

  // Fonction pour récupérer la photo de profil
  const fetchProfileData = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('User ID is missing from localStorage');
      return;
    }

    const res = await fetch(`/api/ModificationProfil?userId=${userId}`);
    const data = await res.json();

    if (res.ok) {
      setProfilePic(data.profilePic || '/images/default-avatar.png');
    } else {
      console.error('Error fetching profile data:', data.error);
    }
  };

  // Fonction pour récupérer le solde du compte (si nécessaire)
  const fetchBalance = async () => {
    const res = await fetch(`/api/balance`);
    const data = await res.json();
    if (res.ok) {
      setBalance(data.balance);
    } else {
      console.error('Error fetching balance:', data.error);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchCryptoData();
    // Si vous avez besoin de récupérer le solde du compte
    // fetchBalance();
  }, []);

  // Fonction pour récupérer les informations sur les cryptomonnaies
  const fetchCryptoData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,dogecoin,solana&vs_currencies=cad&include_market_cap=true&include_24hr_change=true&include_24hr_vol=true&include_24hr_low_high=true'
      );
      // Stocker les informations sur les cryptomonnaies dans l'état
      setCryptoData({
        bitcoin: {
          name: 'Bitcoin (BTC)',
          price: `CA$${response.data.bitcoin.cad}`,
          change: `${response.data.bitcoin.cad_24h_change.toFixed(2)}%`,
          marketCap: response.data.bitcoin.cad_market_cap,
          volume: response.data.bitcoin.cad_24h_vol,
          low24h: response.data.bitcoin.cad_24h_low,
          high24h: response.data.bitcoin.cad_24h_high,
        },
        ethereum: {
          name: 'Ethereum (ETH)',
          price: `CA$${response.data.ethereum.cad}`,
          change: `${response.data.ethereum.cad_24h_change.toFixed(2)}%`,
          marketCap: response.data.ethereum.cad_market_cap,
          volume: response.data.ethereum.cad_24h_vol,
          low24h: response.data.ethereum.cad_24h_low,
          high24h: response.data.ethereum.cad_24h_high,
        },
        cardano: {
          name: 'Cardano (ADA)',
          price: `CA$${response.data.cardano.cad}`,
          change: `${response.data.cardano.cad_24h_change.toFixed(2)}%`,
          marketCap: response.data.cardano.cad_market_cap,
          volume: response.data.cardano.cad_24h_vol,
          low24h: response.data.cardano.cad_24h_low,
          high24h: response.data.cardano.cad_24h_high,
        },
        dogecoin: {
          name: 'Dogecoin (DOGE)',
          price: `CA$${response.data.dogecoin.cad}`,
          change: `${response.data.dogecoin.cad_24h_change.toFixed(2)}%`,
          marketCap: response.data.dogecoin.cad_market_cap,
          volume: response.data.dogecoin.cad_24h_vol,
          low24h: response.data.dogecoin.cad_24h_low,
          high24h: response.data.dogecoin.cad_24h_high,
        },
        solana: {
          name: 'Solana (SOL)',
          price: `CA$${response.data.solana.cad}`,
          change: `${response.data.solana.cad_24h_change.toFixed(2)}%`,
          marketCap: response.data.solana.cad_market_cap,
          volume: response.data.solana.cad_24h_vol,
          low24h: response.data.solana.cad_24h_low,
          high24h: response.data.solana.cad_24h_high,
        },
      });
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer l'historique des prix
  const fetchPriceHistory = async (crypto: string) => {
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
    if (selectedCrypto) {
      fetchPriceHistory(selectedCrypto);
    }
  }, [selectedCrypto]);

  const handleCryptoSelect = (crypto: string) => {
    setSelectedCrypto(crypto);
    setPriceHistory([]);
  };

  const handleReturn = () => {
    setSelectedCrypto(null);
  };

  // Données du graphique
  const chartData = {
    labels: priceHistory.map((data) => data.x),
    datasets: [
      {
        label: `${cryptoData[selectedCrypto || 'bitcoin']?.name} Price (CAD)`,
        data: priceHistory.map((data) => data.y),
        borderColor: '#5d3fd3',
        backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D } }) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(93, 63, 211, 0.4)');
          gradient.addColorStop(1, 'rgba(93, 63, 211, 0.1)');
          return gradient;
        },
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#5d3fd3',
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#3a1a94',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Options du graphique
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
          borderColor: '#e0e0e0',
        },
        ticks: {
          color: '#666',
          font: { size: 12 },
        },
      },
      y: {
        grid: { color: '#e0e0e0' },
        ticks: {
          color: '#666',
          font: { size: 12 },
          callback: function (tickValue: string | number) {
            return `CA$${tickValue}`;
          },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#5d3fd3',
        titleFont: { size: 14 },
        bodyColor: '#333',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: function (context: any) {
            return `Price: CA$${context.raw}`;
          },
        },
      },
    },
  };

  // Ajout d'un console.log pour vérifier la valeur de profilePic
  useEffect(() => {
    console.log('Valeur de profilePic:', profilePic);
  }, [profilePic]);

  return (
    <motion.div className="flex flex-col min-h-screen bg-[#f8f9fa] text-black">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-white shadow-md">
        <Link className="flex items-center justify-center" href="/Dashboard">
          <span className="font-bold text-xl text-[#5d3fd3]">Lazuli</span>
        </Link>
        <nav className="ml-auto flex items-center gap-6">
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/Dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/Transactions">
            Transactions
          </Link>
          {/* Photo de profil dans le header */}
          <Link href="/Profil" className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={profilePic}
              alt="Photo de Profil"
              width={32}
              height={32}
              className="rounded-full"
            />
          </Link>
        </nav>
        <Button
          onClick={handleLogout}
          className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded ml-4"
        >
          Déconnecter
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6">
        {/* Sidebar */}
        <motion.aside
          className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 60 } }}
        >
          <nav className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image src={accueilLogoImg} alt="Accueil Icon" width={30} height={30} />
              <Link href="/Dashboard">
                <span className="block py-2 text-lg font-semibold hover:text-[#5d3fd3] cursor-pointer">
                  Accueil
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className="block py-2 text-lg font-semibold hover:text-[#5d3fd3] cursor-pointer"
                onClick={() => setShowExplore(true)}
              >
                🔎 Explorer
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="block py-2 text-lg font-semibold hover:text-[#5d3fd3] cursor-pointer">
                🔄 Transfer
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Image src={transactionLogoImg} alt="Transaction Icon" width={30} height={30} />
              <Link href="/Transactions">
                <span className="text-lg font-semibold hover:text-[#5d3fd3]">Transactions</span>
              </Link>
            </div>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <section className="flex-1 bg-white p-6 rounded-lg shadow-md">
          {!showExplore ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <h1 className="text-2xl font-bold mb-4">Bienvenue sur Lazuli !</h1>
              <p className="text-gray-700">
                Consultez les dernières informations sur vos cryptomonnaies préférées.
              </p>
            </motion.div>
          ) : selectedCrypto ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {cryptoData[selectedCrypto]?.name} - Prix Historique
                </h3>
                <Button
                  onClick={handleReturn}
                  className="text-sm font-semibold bg-gray-200 text-black py-1 px-3 rounded hover:bg-gray-300"
                >
                  Retour
                </Button>
              </div>
              {loading ? (
                <p>Chargement...</p>
              ) : (
                <div className="relative w-full h-80">
                  <Line data={chartData} options={chartOptions} />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <h2 className="text-2xl font-semibold mb-4">Explorer les Cryptomonnaies</h2>

              {/* Crypto List */}
              <ul className="space-y-4">
                {Object.keys(cryptoData).map((crypto, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
                  >
                    <span className="font-medium">{cryptoData[crypto]?.name}</span>
                    <span className="text-sm text-gray-600">{cryptoData[crypto]?.price}</span>
                    <span
                      className={`text-sm ${
                        cryptoData[crypto]?.change.includes('-')
                          ? 'text-red-500'
                          : 'text-green-500'
                      }`}
                    >
                      {cryptoData[crypto]?.change}
                    </span>
                    <Button
                      onClick={() => handleCryptoSelect(crypto)}
                      className="ml-4 text-sm font-semibold bg-[#5d3fd3] text-white py-1 px-3 rounded hover:bg-[#4629a6]"
                    >
                      Sélectionner
                    </Button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </section>
      </main>
    </motion.div>
  );
}

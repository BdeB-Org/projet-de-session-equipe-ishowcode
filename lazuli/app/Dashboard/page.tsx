'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { FaShoppingCart, FaDollarSign } from 'react-icons/fa'; // Import des icônes
import transactionLogoImg from '../Images/transaction_logo.webp';
import accueilLogoImg from '../Images/home_logo-removebg-preview.png';
import CryptoOfTheDay from '../dailycrypto/page';
import searchLogoImg from '../Images/search.png';
import depotLogoImg from '../Images/money.png';
import quizLogoImg from '../Images/quiz_logo.png';
import ChatIcon from '@/components/chatIcon';
import CryptoConverter from '../CryptoConverter/page';
import InfoDuJour from '../InfoDuJour/page';

// Enregistrement des composants de graphique
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
  id: string;
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

// Interface pour les données de prix dans le graphique
interface PriceData {
  x: string;
  y: number;
}

// Composant principal
export default function DashboardPage() {
  const [showExplore, setShowExplore] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [cryptoData, setCryptoData] = useState<{ [key: string]: CryptoInfo }>({});
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState('/images/default-avatar.png');
  const [balance, setBalance] = useState<number>(0);
  const [currency, setCurrency] = useState('cad'); // État pour la devise
  const [amount, setAmount] = useState<number>(0);
  const [transactionType, setTransactionType] = useState<'buy' | 'sell' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<{ [cryptoId: string]: number }>({});
  const [balanceHistory, setBalanceHistory] = useState<{ date: string; balance: number }[]>([]);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState<boolean>(false); // Nouvel état

  const router = useRouter();

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');

    router.push('/');
  };

  // Fonction pour récupérer le solde de l'utilisateur
  const fetchBalance = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User ID is missing from localStorage');
        return;
      }
      const response = await axios.get(`/api/getBalance?userId=${userId}`);
      console.log('Balance fetched:', response.data);
      if (response.data) {
        setBalance(response.data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setErrorMessage('Erreur lors de la récupération du solde');
    }
  };

  // Fonction pour récupérer la photo de profil et la devise
  const fetchProfileData = async () => {
    const userId = localStorage.getItem('userId');
    console.log('User ID:', userId);

    if (!userId) {
      console.error('User ID is missing from localStorage');
      return;
    }

    try {
      // Lire la devise depuis localStorage
      const storedCurrency = localStorage.getItem('currency');
      if (storedCurrency) {
        setCurrency(storedCurrency.toLowerCase());
      }

      const res = await fetch(`/api/ModificationProfil?userId=${userId}`);
      const data = await res.json();

      console.log('Profile Data:', data);

      if (res.ok) {
        // Correction du chemin de l'image
        const correctedProfilePic = data.profilePic.startsWith('/public')
          ? data.profilePic.replace('/public', '')
          : data.profilePic;
        setProfilePic(correctedProfilePic || '/images/default-avatar.png');
        setBalance(data.balance);

        // Mettre à jour la devise si différente
        if (data.currency && data.currency.toLowerCase() !== storedCurrency?.toLowerCase()) {
          setCurrency(data.currency.toLowerCase());
          // Mettre à jour localStorage
          localStorage.setItem('currency', data.currency.toLowerCase());
        }
      } else {
        console.error('Error fetching profile data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setErrorMessage('Erreur lors de la récupération des données du profil');
    }
  };

  // Fonction pour récupérer le portefeuille de l'utilisateur
  const fetchPortfolio = async () => {
    try {
      setIsPortfolioLoading(true);
      const userId = localStorage.getItem('userId');
      console.log('Fetched userId:', userId);
      if (!userId) {
        console.error('User ID is missing from localStorage');
        setIsPortfolioLoading(false);
        return;
      }
      const response = await axios.get(`/api/getPortfolio?userId=${userId}`);
      console.log('Response from /api/getPortfolio:', response.data);
      if (response.data) {
        setPortfolio(response.data.portfolio);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setErrorMessage('Erreur lors de la récupération du portefeuille');
    } finally {
      setIsPortfolioLoading(false);
    }
  };

  // Fonction pour récupérer l'historique du solde
  const fetchBalanceHistory = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User ID is missing from localStorage');
        return;
      }
      const response = await axios.get(`/api/getBalanceHistory?userId=${userId}`);
      console.log('Balance History fetched:', response.data);
      if (response.data) {
        setBalanceHistory(response.data.history);
        console.log('Balance History state updated:', response.data.history);
      }
    } catch (error) {
      console.error('Error fetching balance history:', error);
      setErrorMessage('Erreur lors de la récupération de l\'historique du solde');
    }
  };

  // Fonction pour obtenir le symbole de la devise
  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode.toLowerCase()) {
      case 'usd':
        return '$';
      case 'eur':
        return '€';
      case 'gbp':
        return '£';
      case 'cad':
        return 'CA$';
      case 'idr':
        return 'Rp';
      default:
        return currencyCode.toUpperCase() + '$';
    }
  };

  // Fonction pour récupérer les informations sur les cryptomonnaies avec l'API CoinGecko
  const fetchCryptoData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price`,
        {
          params: {
            ids: 'bitcoin,ethereum,cardano,dogecoin,solana',
            vs_currencies: currency,
            include_market_cap: true,
            include_24hr_change: true,
            include_24hr_vol: true,
            include_24hr_low_high: true,
          },
        }
      );

      console.log('Crypto Data fetched:', response.data);

      // Stocker les informations sur les cryptomonnaies dans l'état
      setCryptoData({
        bitcoin: {
          id: 'bitcoin',
          name: 'Bitcoin (BTC)',
          price: `${getCurrencySymbol(currency)}${response.data.bitcoin[currency]}`,
          change: `${response.data.bitcoin[`${currency}_24h_change`]?.toFixed(2) || '0.00'}%`,
          marketCap: response.data.bitcoin[`${currency}_market_cap`],
          volume: response.data.bitcoin[`${currency}_24h_vol`],
          low24h: response.data.bitcoin[`${currency}_24h_low`],
          high24h: response.data.bitcoin[`${currency}_24h_high`],
          circulatingSupply: response.data.bitcoin.circulating_supply,
          totalSupply: response.data.bitcoin.total_supply,
        },
        ethereum: {
          id: 'ethereum',
          name: 'Ethereum (ETH)',
          price: `${getCurrencySymbol(currency)}${response.data.ethereum[currency]}`,
          change: `${response.data.ethereum[`${currency}_24h_change`]?.toFixed(2) || '0.00'}%`,
          marketCap: response.data.ethereum[`${currency}_market_cap`],
          volume: response.data.ethereum[`${currency}_24h_vol`],
          low24h: response.data.ethereum[`${currency}_24h_low`],
          high24h: response.data.ethereum[`${currency}_24h_high`],
          circulatingSupply: response.data.ethereum.circulating_supply,
          totalSupply: response.data.ethereum.total_supply,
        },
        cardano: {
          id: 'cardano',
          name: 'Cardano (ADA)',
          price: `${getCurrencySymbol(currency)}${response.data.cardano[currency]}`,
          change: `${response.data.cardano[`${currency}_24h_change`]?.toFixed(2) || '0.00'}%`,
          marketCap: response.data.cardano[`${currency}_market_cap`],
          volume: response.data.cardano[`${currency}_24h_vol`],
          low24h: response.data.cardano[`${currency}_24h_low`],
          high24h: response.data.cardano[`${currency}_24h_high`],
          circulatingSupply: response.data.cardano.circulating_supply,
          totalSupply: response.data.cardano.total_supply,
        },
        dogecoin: {
          id: 'dogecoin',
          name: 'Dogecoin (DOGE)',
          price: `${getCurrencySymbol(currency)}${response.data.dogecoin[currency]}`,
          change: `${response.data.dogecoin[`${currency}_24h_change`]?.toFixed(2) || '0.00'}%`,
          marketCap: response.data.dogecoin[`${currency}_market_cap`],
          volume: response.data.dogecoin[`${currency}_24h_vol`],
          low24h: response.data.dogecoin[`${currency}_24h_low`],
          high24h: response.data.dogecoin[`${currency}_24h_high`],
          circulatingSupply: response.data.dogecoin.circulating_supply,
          totalSupply: response.data.dogecoin.total_supply,
        },
        solana: {
          id: 'solana',
          name: 'Solana (SOL)',
          price: `${getCurrencySymbol(currency)}${response.data.solana[currency]}`,
          change: `${response.data.solana[`${currency}_24h_change`]?.toFixed(2) || '0.00'}%`,
          marketCap: response.data.solana[`${currency}_market_cap`],
          volume: response.data.solana[`${currency}_24h_vol`],
          low24h: response.data.solana[`${currency}_24h_low`],
          high24h: response.data.solana[`${currency}_24h_high`],
          circulatingSupply: response.data.solana.circulating_supply,
          totalSupply: response.data.solana.total_supply,
        },
      });
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      setErrorMessage('Erreur lors de la récupération des données des cryptomonnaies');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour rechercher des cryptomonnaies
  const handleSearch = async () => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/search`,
        {
          params: {
            query: searchQuery,
          },
        }
      );
      setSearchResults(response.data.coins);
    } catch (error) {
      console.error('Erreur lors de la recherche de cryptomonnaies:', error);
      setErrorMessage('Erreur lors de la recherche de cryptomonnaies');
    }
  };

  // Utiliser un debounce pour la recherche
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Fonction pour récupérer les données de la cryptomonnaie sélectionnée
  const fetchSelectedCryptoData = async (cryptoId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets`,
        {
          params: {
            vs_currency: currency,
            ids: cryptoId,
          },
        }
      );
      if (response.data && response.data.length > 0) {
        const cryptoInfo = response.data[0];
        setCryptoData((prevData) => ({
          ...prevData,
          [cryptoId]: {
            id: cryptoId,
            name: `${cryptoInfo.name} (${cryptoInfo.symbol.toUpperCase()})`,
            price: `${getCurrencySymbol(currency)}${cryptoInfo.current_price}`,
            change: `${cryptoInfo.price_change_percentage_24h?.toFixed(2) || '0.00'}%`,
            marketCap: cryptoInfo.market_cap,
            volume: cryptoInfo.total_volume,
            low24h: cryptoInfo.low_24h,
            high24h: cryptoInfo.high_24h,
            circulatingSupply: cryptoInfo.circulating_supply,
            totalSupply: cryptoInfo.total_supply,
          },
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données de la cryptomonnaie:', error);
      setErrorMessage('Erreur lors de la récupération des données de la cryptomonnaie');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer l'historique des prix
  const fetchPriceHistory = async (cryptoId: string) => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart`,
        {
          params: {
            vs_currency: currency,
            days: 7,
          },
        }
      );
      const prices = response.data.prices.map((price: any[]) => ({
        x: new Date(price[0]).toLocaleDateString(),
        y: price[1],
      }));
      setPriceHistory(prices);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des prix:', error);
      setErrorMessage('Erreur lors de la récupération de l\'historique des prix');
    }
  };

  // Fonction pour gérer les transactions
  const handleTransaction = async (cryptoId: string) => {
    if (!cryptoId || !transactionType || amount <= 0 || isNaN(amount)) {
      setErrorMessage('Veuillez sélectionner une transaction et entrer un montant valide');
      setSuccessMessage(null);
      return;
    }

    const cryptoPriceStr = cryptoData[cryptoId].price;
    const cryptoPrice = parseFloat(cryptoPriceStr.replace(/[^\d.-]/g, ''));
    const transactionValue = amount * cryptoPrice;

    // Ne pas mettre à jour le solde ici
    if (transactionType === 'buy') {
      if (balance < transactionValue) {
        setErrorMessage('Solde insuffisant');
        setSuccessMessage(null);
        return;
      }
      // Ne pas modifier le solde ici
    } else if (transactionType === 'sell') {
      // Ne pas modifier le solde ici
    }

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setErrorMessage('Utilisateur non identifié');
        setSuccessMessage(null);
        return;
      }
      // Enregistrer la transaction dans la base de données
      const transactionData = {
        userId: userId,
        type: transactionType,
        crypto: cryptoId,
        amount: amount,
        value: transactionValue,
        date: new Date(),
      };

      const response = await axios.post(`/api/transactions`, transactionData);
      console.log('Transaction réussie', response.data);

      // Mettre à jour le solde et le portefeuille avec les données du serveur
      setBalance(response.data.balance);
      setPortfolio(response.data.portfolio);
      setSuccessMessage(
        `Transaction réussie ! Nouveau solde : ${getCurrencySymbol(currency)}${response.data.balance.toFixed(2)}`
      );
      setErrorMessage(null);

      // **Rafraîchir l'historique du solde après une transaction réussie**
      await fetchBalanceHistory();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la transaction:", error);
      setErrorMessage("Erreur lors de l'enregistrement de la transaction");
      setSuccessMessage(null);
    }

    setAmount(0);
    setTransactionType(null);
  };

  // Effet pour récupérer les données du profil, portefeuille et historique du solde au montage
  useEffect(() => {
    fetchProfileData();
    fetchPortfolio();
    fetchBalanceHistory();
  }, []);

  // Effet pour récupérer le solde au montage
  useEffect(() => {
    fetchBalance();
  }, []);

  // Effet pour récupérer les données des cryptomonnaies lorsque la devise change
  useEffect(() => {
    if (currency) {
      fetchCryptoData();
    }
  }, [currency]);

  // Effet pour récupérer l'historique des prix lorsque la crypto ou la devise change
  useEffect(() => {
    if (selectedCrypto) {
      fetchPriceHistory(selectedCrypto);
    }
  }, [selectedCrypto, currency]);

  // Effet pour mettre à jour la devise lorsque la fenêtre reçoit le focus
  useEffect(() => {
    const handleWindowFocus = () => {
      const storedCurrency = localStorage.getItem('currency');
      if (storedCurrency && storedCurrency.toLowerCase() !== currency) {
        setCurrency(storedCurrency.toLowerCase());
      }
    };

    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [currency]);

  // Effet pour rafraîchir l'historique du solde toutes les minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBalanceHistory();
    }, 60000); // 60000 ms = 1 minute

    return () => clearInterval(interval); // Nettoyage à la désactivation du composant
  }, []);

  const handleCryptoSelect = (cryptoId: string) => {
    setSelectedCrypto(cryptoId);
    setPriceHistory([]);
    fetchSelectedCryptoData(cryptoId);
  };

  const handleReturn = () => {
    setSelectedCrypto(null);
    setTransactionType(null);
    setAmount(0);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Données du graphique des prix
  const chartData = useMemo(() => ({
    labels: priceHistory.map((data) => data.x),
    datasets: [
      {
        label: `${cryptoData[selectedCrypto || 'bitcoin']?.name} Prix (${getCurrencySymbol(currency)})`,
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
  }), [priceHistory, cryptoData, selectedCrypto, currency]);

  // Données du graphique du solde
  const balanceChartData = useMemo(() => ({
    labels: balanceHistory.map((entry) => entry.date),
    datasets: [
      {
        label: 'Solde au fil du temps',
        data: balanceHistory.map((entry) => entry.balance),
        borderColor: '#5d3fd3',
        backgroundColor: 'rgba(93, 63, 211, 0.4)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#5d3fd3',
        tension: 0.4,
        fill: true,
      },
    ],
  }), [balanceHistory]);

  // Générer une clé unique basée sur la longueur de balanceHistory
  const balanceChartKey = `balance-chart-${balanceHistory.length}`;

  // Options du graphique
  const chartOptions = useMemo(() => ({
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
            return `${getCurrencySymbol(currency)}${tickValue}`;
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
            return `Prix: ${getCurrencySymbol(currency)}${context.raw}`;
          },
        },
      },
    },
  }), [currency]);

  return (
    <motion.div className="flex flex-col min-h-screen bg-[#f8f9fa] text-black">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-white shadow-md">
        <Link className="flex items-center justify-center" href="/Dashboard" replace>
          <span className="font-bold text-xl text-[#5d3fd3]">Lazuli</span>
        </Link>
        <nav className="ml-auto flex items-center gap-6">
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/Dashboard" replace>
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:text-[#5d3fd3]" href="/Transactions">
            Transactions
          </Link>
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
              <span
                className={`block py-2 text-lg font-semibold cursor-pointer ${
                  !showExplore ? 'text-[#5d3fd3]' : 'hover:text-[#5d3fd3] text-black'
                }`}
                onClick={() => setShowExplore(false)}
              >
                Accueil
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Image src={searchLogoImg} alt="Explorer Icon" width={30} height={30} />
              <span
                className={`block py-2 text-lg font-semibold cursor-pointer ${
                  showExplore ? 'text-[#5d3fd3]' : 'hover:text-[#5d3fd3] text-black'
                }`}
                onClick={() => setShowExplore(true)}
              >
                Explorer
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Image src={depotLogoImg} alt="Dépôt Icon" width={30} height={30} />
              <Link href="/Depot">
                <span className="block py-2 text-lg font-semibold hover:text-[#5d3fd3] cursor-pointer">
                  Dépôt
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Image src={transactionLogoImg} alt="Transaction Icon" width={30} height={30} />
              <Link href="/Transactions">
                <span className="text-lg font-semibold hover:text-[#5d3fd3]">Transactions</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Image src={quizLogoImg.src} alt="Quiz Icon" width={30} height={30} />
              <Link className="text-lg font-semibold hover:text-[#5d3fd3]" href="/Quiz">
                Quiz d'Investissement
              </Link>
            </div>
          </nav>
        </motion.aside>

        {/* Main Dashboard */}
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

              {/* Balance */}
              <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-[#5d3fd3]">Votre Solde</h2>
                <p className="text-2xl font-bold text-black">
                  {getCurrencySymbol(currency)}
                  {balance ? balance.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
                </p>
              </div>

              {/* Portefeuille */}
              <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-[#5d3fd3]">Votre Portefeuille</h2>
                {isPortfolioLoading ? (
                  <p className="mt-4 text-gray-600">Chargement du portefeuille...</p>
                ) : Object.keys(portfolio).length > 0 ? (
                  <>
                    {console.log('Portfolio:', portfolio)}
                    {console.log('Crypto Data:', cryptoData)}
                    <ul className="mt-4 space-y-2">
                      {Object.keys(portfolio).map((cryptoId) => (
                        <li key={cryptoId} className="flex justify-between items-center">
                          <span>{cryptoData[cryptoId]?.name || cryptoId}</span>
                          <span>{portfolio[cryptoId]}</span>
                          <Button
                            onClick={() => {
                              setSelectedCrypto(cryptoId);
                              setShowExplore(true);
                            }}
                            className="ml-4 text-sm font-semibold bg-[#5d3fd3] text-white py-1 px-3 rounded hover:bg-[#4629a6]"
                          >
                            Détails
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="mt-4 text-gray-600">Vous ne possédez aucune cryptomonnaie pour le moment.</p>
                )}
              </div>

              {/* Graphique du Solde */}
              <div className="mt-6 p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold text-[#5d3fd3] mb-4">Historique du Solde</h2>
                {balanceHistory.length > 0 ? (
                  <div className="relative w-full h-80">
                    <Line key={balanceChartKey} data={balanceChartData} options={chartOptions} />
                  </div>
                ) : (
                  <p className="text-gray-600">Aucune donnée disponible pour le graphique.</p>
                )}
              </div>

              {/* Autres composants */}
              <div className="mt-4">
                <CryptoConverter />
              </div>
              <div className="mt-4">
                <InfoDuJour />
              </div>
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

              <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2 text-[#5d3fd3]">
                  Informations supplémentaires
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <p>
                    <strong>Market Cap:</strong> {getCurrencySymbol(currency)}
                    {cryptoData[selectedCrypto]?.marketCap?.toLocaleString() || 'N/A'}
                  </p>
                  <p>
                    <strong>Volume:</strong> {getCurrencySymbol(currency)}
                    {cryptoData[selectedCrypto]?.volume?.toLocaleString() || 'N/A'}
                  </p>
                  <p>
                    <strong>Low 24h:</strong> {getCurrencySymbol(currency)}
                    {cryptoData[selectedCrypto]?.low24h?.toFixed(2) || 'N/A'}
                  </p>
                  <p>
                    <strong>High 24h:</strong> {getCurrencySymbol(currency)}
                    {cryptoData[selectedCrypto]?.high24h?.toFixed(2) || 'N/A'}
                  </p>
                  <p>
                    <strong>Circulating Supply:</strong>{' '}
                    {cryptoData[selectedCrypto]?.circulatingSupply?.toLocaleString() || 'N/A'}
                  </p>
                  <p>
                    <strong>Total Supply:</strong>{' '}
                    {cryptoData[selectedCrypto]?.totalSupply?.toLocaleString() || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Solde actuel */}
              <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-[#5d3fd3]">Votre Solde Actuel</h2>
                <p className="text-xl font-bold text-black">
                  {getCurrencySymbol(currency)}
                  {balance ? balance.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
                </p>
              </div>

              {/* Buy and Sell Buttons */}
              <div className="mt-6">
                {/* Onglets Buy et Sell */}
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setTransactionType('buy')}
                    className={`flex-1 py-2 px-4 text-center font-semibold ${
                      transactionType === 'buy'
                        ? 'border-b-2 border-green-500 text-green-500'
                        : 'text-gray-600 hover:text-green-500'
                    } transition-colors duration-200`}
                  >
                    <div className="flex items-center justify-center">
                      <FaShoppingCart className="mr-2" />
                      Acheter
                    </div>
                  </button>
                  <button
                    onClick={() => setTransactionType('sell')}
                    className={`flex-1 py-2 px-4 text-center font-semibold ${
                      transactionType === 'sell'
                        ? 'border-b-2 border-red-500 text-red-500'
                        : 'text-gray-600 hover:text-red-500'
                    } transition-colors duration-200`}
                  >
                    <div className="flex items-center justify-center">
                      <FaDollarSign className="mr-2" />
                      Vendre
                    </div>
                  </button>
                </div>

                <AnimatePresence>
                  {transactionType && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 p-4 bg-gray-50 rounded-lg shadow-md"
                    >
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleTransaction(selectedCrypto!);
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            {transactionType === 'buy' ? 'Montant à Acheter' : 'Montant à Vendre'}
                          </label>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                            placeholder={`Entrez le montant en ${selectedCrypto}`}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d3fd3] transition duration-200"
                            required
                            min="0"
                            step="any"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Button
                            type="submit"
                            className="w-full bg-[#5d3fd3] text-white py-2 px-4 rounded-lg hover:bg-[#4629a6] transition-colors duration-200"
                          >
                            Confirmer Transaction
                          </Button>
                        </div>

                        {/* Affichage des messages */}
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                        {successMessage && <p className="text-green-500">{successMessage}</p>}
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <h2 className="text-2xl font-semibold mb-4">Explorer les Cryptomonnaies</h2>

              {/* Affichage du solde */}
              <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-[#5d3fd3]">Votre Solde</h2>
                <p className="text-2xl font-bold text-black">
                  {getCurrencySymbol(currency)}
                  {balance ? balance.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
                </p>
              </div>

              <CryptoOfTheDay cryptoData={cryptoData} />

              {/* Barre de recherche */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Rechercher une cryptomonnaie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d3fd3] transition duration-200"
                />
              </div>

              {/* Résultats de la recherche */}
              {searchResults.length > 0 && (
                <ul className="space-y-4">
                  {searchResults.map((crypto) => (
                    <li
                      key={crypto.id}
                      className="flex justify-between items-center bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      <span className="font-medium">
                        {crypto.name} ({crypto.symbol.toUpperCase()})
                      </span>
                      <Button
                        onClick={() => handleCryptoSelect(crypto.id)}
                        className="text-sm font-semibold bg-[#5d3fd3] text-white py-1 px-3 rounded hover:bg-[#4629a6] transition-colors duration-200"
                      >
                        Sélectionner
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Liste des cryptomonnaies prédéfinies */}
              <ul className="space-y-4 mt-4">
                {Object.keys(cryptoData).map((crypto, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
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
                      className="text-sm font-semibold bg-[#5d3fd3] text-white py-1 px-3 rounded hover:bg-[#4629a6] transition-colors duration-200"
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
      <ChatIcon />
    </motion.div>
  );
}

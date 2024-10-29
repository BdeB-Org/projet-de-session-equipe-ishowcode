'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

const Explore = () => {
  // etat pour stocker la liste des cryptomonnaies
  const [cryptoList, setCryptoList] = useState<{
    id: string;
    image: string;
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
  }[]>([]);
  // etat pour stocker la cryptomonnaie selectionnee
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [priceData, setPriceData] = useState<{ time: string; value: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState('7');
  // etat pour stocker les donnees du marche
  const [marketCap, setMarketCap] = useState<number | null>(null);
  const [volume, setVolume] = useState<number | null>(null);
  const [high24h, setHigh24h] = useState<number | null>(null);
  const [low24h, setLow24h] = useState<number | null>(null);

  useEffect(() => {
    // fonction pour recuperer les cryptomonnaies
    const fetchCryptos = async () => {
      try {
        const result = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            ids: 'bitcoin,ethereum,cardano,solana,polkadot,dogecoin',
            order: 'market_cap_desc',
          },
        });
        setCryptoList(result.data);
      } catch (error) {
        console.error('Error fetching cryptocurrencies:', error);
      }
    };

    fetchCryptos();
  }, []);

  const fetchCryptoGraphData = async (id: string) => {
    // reinitialiser les etats, quand on en prend un nouveau ca les met a jour
    setError(null);
    try {
      const result = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: days,
        },
      });
      // on recupere les donnees de la cryptomonnaie selectionnee
      const prices = result.data.prices.map((price: [number, number]) => ({
        time: new Date(price[0]).toLocaleDateString(),
        value: price[1],
      }));
      setPriceData(prices);
      setSelectedCrypto(id);

      const cryptoDetails = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
      setMarketCap(cryptoDetails.data.market_data.market_cap.usd);
      setVolume(cryptoDetails.data.market_data.total_volume.usd);
      setHigh24h(cryptoDetails.data.market_data.high_24h.usd);
      setLow24h(cryptoDetails.data.market_data.low_24h.usd);
    } catch (error) {
      setError('Error');
      console.error('Error fetching crypto graph data:', error);
    }
  };

  const handleDaysChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // on change le nombre de jours
    setDays(event.target.value);
    if (selectedCrypto) {
      fetchCryptoGraphData(selectedCrypto);
    }
  };

  return (
    // affichage des cryptomonnaies
    <motion.div className="w-full lg:w-3/4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Explore Cryptocurrencies</h2>

      <div className="flex">
        <div className="w-1/2">
          <ul className="space-y-4">
            {cryptoList.map((crypto) => (
              <li
                key={crypto.id}
                className="flex items-center justify-between p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                onClick={() => fetchCryptoGraphData(crypto.id)}
              >
                <div className="flex items-center space-x-4">
                  <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
                  <div>
                    <p className="font-semibold">{crypto.name}</p>
                    <p className="text-sm text-gray-500">{crypto.symbol.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${crypto.current_price.toFixed(2)}</p>
                  <p
                    className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                  >
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Graph */}
        <div className="w-1/2 ml-4">
          <label htmlFor="days" className="mb-2 block">Select Time Range:</label>
          <select id="days" onChange={handleDaysChange} value={days} className="mb-4">
            <option value="1">1 Day</option>
            <option value="7">7 Days</option>
            <option value="30">30 Days</option>
          </select>

          {error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : selectedCrypto && priceData.length > 0 ? (
            <>
              <Line
                data={{
                  labels: priceData.map((data) => data.time),
                  datasets: [
                    {
                      label: 'Prix en CAD',
                      data: priceData.map((data) => data.value),
                      borderColor: 'rgba(75, 192, 192, 1)',
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      fill: true,
                      tension: 0.4,
                      pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                      pointRadius: 3,
                      pointHoverRadius: 6,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                    },
                    legend: {
                      display: true,
                      position: 'top',
                      labels: {
                        color: '#000',
                      },
                    },
                  },
                  scales: {
                    x: {
                      type: 'time',
                      time: {
                        unit: 'day',
                      },
                      ticks: {
                        color: '#000',
                      },
                    },
                    y: {
                      ticks: {
                        callback: function (value) {
                          return `$${Number(value).toFixed(2)}`;
                        },
                        color: '#000',
                      },
                    },
                  },
                }}
              />
              <div className="mt-4">
                {/* données addiotinels */}
                <h3 className="text-lg font-semibold">{selectedCrypto?.toUpperCase()} Market Data</h3>
                <p>Market Cap: ${marketCap ? marketCap.toLocaleString() : 'Load...'}</p>
                <p>Volume: ${volume ? volume.toLocaleString() : 'Load...'}</p>
                <p>24h High: ${high24h ? high24h.toLocaleString() : 'Load...'}</p>
                <p>24h Low: ${low24h ? low24h.toLocaleString() : 'Load...'}</p>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500"></p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Explore;

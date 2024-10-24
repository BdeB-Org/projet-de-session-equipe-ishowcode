import { useState, useEffect } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
);

export default function BalanceChart() {
  interface BalanceEntry {
    date: string;
    balance: number;
  }

  const [balanceData, setBalanceData] = useState<BalanceEntry[]>([]);
  const userId = "your_user_id"; 

  const fetchBalanceHistory = async () => {
    try {
      const response = await fetch(`/api/updateBalance?userId=${userId}`); 
      if (!response.ok) {
        throw new Error("Failed to fetch balance history");
      }
      const data = await response.json();
      console.log("Raw data:", data); 
      const formattedData = data.map((entry: any) => ({
        date: entry.date.toISOString().split('T')[0], 
        balance: entry.balance,
      }));
      setBalanceData(formattedData);
    } catch (error) {
      console.error("Error fetching balance history:", error);
    }
  };

  useEffect(() => {
    fetchBalanceHistory(); 
  }, []);

  const updateBalanceInDB = async (newBalance: number) => {
    try {
      const response = await fetch('/api/updateBalance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newBalance }),
      });

      if (!response.ok) {
        throw new Error("Failed to update balance");
      }
      const data = await response.json();
      console.log(data.message);
      fetchBalanceHistory(); 
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  const changeBalance = (newBalance: number) => {
    updateBalanceInDB(newBalance); 
  };

  const chartData = {
    labels: balanceData.map((entry) => entry.date),
    datasets: [
      {
        label: 'Balance (CAD)',
        data: balanceData.map((entry) => entry.balance),
        borderColor: '#5d3fd3',
        backgroundColor: (context: { chart: { ctx: any; }; }) => {
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
          callback: (tickValue: any) => `CA$${tickValue}`,
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
          label: (context: { raw: any; }) => `Balance: CA$${context.raw}`,
        },
      },
    },
  };

  return (
    <div className="relative w-full h-80">
      <Line data={chartData} options={chartOptions} />
      <button onClick={() => changeBalance(1400)}>Update Balance</button>
    </div>
  );
}

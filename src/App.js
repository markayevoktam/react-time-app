// Importlar
import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import './App.css';

function App() {
  // State lar
  const [rates, setRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('General');

  // Ko'rsatiladigan asosiy valyutalar
  const mainCurrencies = ['USD', 'EUR', 'UZS'];

  // Valyuta kurslarini olish
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
        );
        const data = await response.json();
        setRates(data.rates);
      } catch (error) {
        console.error('Valyuta kurslarini olishda xatolik:', error);
      }
    };
    fetchRates();
  }, [baseCurrency]);

  // Tranzaksiyalarni qo'shish
  const addTransaction = () => {
    const newTransaction = {
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toLocaleDateString(),
    };
    setTransactions([...transactions, newTransaction]);
    setAmount('');
    setType('income');
    setCategory('General');
  };

  // Doira diagrammasi ma’lumotlari
  const chartData = {
    labels: transactions.map((t) => t.category), // Kategoriyalar nomlari
    datasets: [
      {
        label: 'Tranzaksiya taqsimoti',
        data: transactions.map((t) => t.amount), // Miqdorlar
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="app-container">
      <h1 className="title">Shaxsiy Moliyaviy Boshqaruv</h1>

      <div className="section currency-section">
        <h3>Real vaqt valyuta kurslari</h3>
        <label htmlFor="currency">Asosiy valyuta</label>
        <select
          id="currency"
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
        >
          {Object.keys(rates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <ul className="rates-list">
          {mainCurrencies.map((currency) => (
            <li key={currency}>
              1 {baseCurrency} = {rates[currency] ? rates[currency].toFixed(2) : '...'} {currency}
            </li>
          ))}
        </ul>
      </div>

      <div className="section transaction-section">
        <h3>Yangi tranzaksiya qo'shish</h3>
        <div className="form-group">
          <label>Miqdor</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Tranzaksiya turi</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="income">Daromad</option>
            <option value="expense">Xarajat</option>
          </select>
        </div>
        <div className="form-group">
          <label>Kategoriya</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <button className="add-button" onClick={addTransaction}>
          Qo'shish
        </button>
      </div>

      <div className="section transaction-list">
        <h3>Tranzaksiyalar ro'yxati</h3>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Sana</th>
              <th>Miqdor</th>
              <th>Turi</th>
              <th>Kategoriya</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{t.date}</td>
                <td>{t.amount}</td>
                <td>{t.type === 'income' ? 'Daromad' : 'Xarajat'}</td>
                <td>{t.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section chart-section">
        <h3>Moliyaviy Tranzaksiyalar Grafikasi</h3>
        <Doughnut data={chartData} />
      </div>
    </div>
  );
}

export default App;

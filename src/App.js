import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Swords, Plus, Trash2, Heart, Sparkles, Filter, Download } from 'lucide-react';

export default function App() {
  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('riftbound_matches');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        date: '2026-09-20',
        userDeck: 'Ahri / Karma',
        sarahDeck: 'Teemo / Fizz',
        g1Result: 'User',
        g2Result: 'GF',
        g3Result: 'User',
        MatchesResult: '2 - 1',
        winner: 'User'
      }
    ];
  });

  const [formData, setFormData] = useState({
    userDeck: '',
    sarahDeck: '',
    g1Result: 'User',
    g2Result: 'User',
    g3Result: 'None'
  });

  const [filterDeck, setFilterDeck] = useState('All');

  useEffect(() => {
    localStorage.setItem('riftbound_matches', JSON.stringify(matches));
  }, [matches]);

  const handleAddMatch = (e) => {
    e.preventDefault();
    if (!formData.userDeck || !formData.sarahDeck) return;

    let userWins = 0;
    let gfWins = 0;

    const games = [formData.g1Result, formData.g2Result, formData.g3Result];
    games.forEach((g) => {
      if (g === 'User') userWins++;
      if (g === 'GF') gfWins++;
    });

    let winner = 'Draw';
    if (userWins > gfWins) winner = 'User';
    else if (gfWins > userWins) winner = 'GF';

    const newMatch = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      userDeck: formData.userDeck,
      sarahDeck: formData.sarahDeck,
      g1Result: formData.g1Result,
      g2Result: formData.g2Result,
      g3Result: formData.g3Result,
      MatchesResult: `${userWins} - ${gfWins}`,
      winner
    };

    setMatches([newMatch, ...matches]);
    setFormData({
      userDeck: '',
      sarahDeck: '',
      g1Result: 'User',
      g2Result: 'User',
      g3Result: 'None'
    });
  };

  const handleDelete = (id) => {
    setMatches(matches.filter((m) => m.id !== id));
  };

  // Stats calculation
  const totalMatches = matches.length;
  const userMatchesWins = matches.filter((m) => m.winner === 'User').length;
  const gfMatchesWins = matches.filter((m) => m.winner === 'GF').length;
  const winRate = totalMatches > 0 ? Math.round((userMatchesWins / totalMatches) * 100) : 0;

  return (
    <div className="min-h-screen bg-rose-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="bg-white rounded-3xl p-6 shadow-sm border border-rose-100 text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 px-4 py-1 rounded-full text-sm font-semibold">
            <Heart size={16} fill="currentColor" /> Riftbound
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
            Kevin vs Sarah ⚔️
          </h1>
          <p className="text-slate-500 text-sm">BO3 tracker</p>
        </header>

        {/* Scoreboard Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm text-center">
            <p className="text-xs text-slate-400 font-bold uppercase">Sarah's Wins</p>
            <p className="text-3xl font-extrabold text-rose-500 mt-1">{gfMatchesWins}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm text-center">
            <p className="text-xs text-slate-400 font-bold uppercase">Kevin's Wins</p>
            <p className="text-3xl font-extrabold text-indigo-500 mt-1">{userMatchesWins}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm text-center">
            <p className="text-xs text-slate-400 font-bold uppercase">Total Matches</p>
            <p className="text-3xl font-extrabold text-slate-700 mt-1">{totalMatches}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm text-center">
            <p className="text-xs text-slate-400 font-bold uppercase">Your Win Rate</p>
            <p className="text-3xl font-extrabold text-emerald-500 mt-1">{winRate}%</p>
          </div>
        </div>

        {/* Log Match Form */}
        <form onSubmit={handleAddMatch} className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <Plus size={18} className="text-rose-500" /> Log New BO3 Match
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Kevin's Deck</label>
              <input
                type="text"
                placeholder="e.g. Ahri / Karma"
                value={formData.userDeck}
                onChange={(e) => setFormData({ ...formData, userDeck: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Sarah's Deck</label>
              <input
                type="text"
                placeholder="e.g. Teemo / Fizz"
                value={formData.sarahDeck}
                onChange={(e) => setFormData({ ...formData, sarahDeck: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {['g1Result', 'g2Result', 'g3Result'].map((gameKey, idx) => (
              <div key={gameKey}>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Game {idx + 1}
                </label>
                <select
                  value={formData[gameKey]}
                  onChange={(e) => setFormData({ ...formData, [gameKey]: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm bg-white"
                >
                  <option value="User">Kevin Won</option>
                  <option value="GF">Sarah Won</option>
                  {idx === 2 && <option value="None">Not Played (2-0)</option>}
                  <option value="Draw">Draw</option>
                </select>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Sparkles size={18} /> Record Match Result
          </button>
        </form>

        {/* Ledger Table */}
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-700">Match History</h3>
            <span className="text-xs text-slate-400">{matches.length} recorded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-rose-50/50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Sarah's Deck</th>
                  <th className="p-4">Kevin's Deck</th>
                  <th className="p-4 text-center">BO3 Score</th>
                  <th className="p-4 text-center">Winner</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matches.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 text-slate-400 text-xs">{m.date}</td>
                    <td className="p-4 font-semibold text-slate-700">{m.userDeck}</td>
                    <td className="p-4 font-semibold text-slate-700">{m.sarahDeck}</td>
                    <td className="p-4 text-center font-bold text-slate-600">{m.MatchesResult}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        m.winner === 'User' 
                          ? 'bg-slate-100 text-indigo-600' 
                          : m.winner === 'GF' 
                          ? 'bg-rose-100 text-rose-600' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {m.winner === 'User' ? 'Kevin' : m.winner === 'GF' ? 'Sarah' : 'Tie'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
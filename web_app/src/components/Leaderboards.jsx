import React, { useState } from 'react';
import { Award, Zap, Crosshair } from 'lucide-react';

export default function Leaderboards({ data }) {
  const [activeTab, setActiveTab] = useState('batting');

  if (!data || !data.top_batsmen || !data.top_bowlers) return null;

  const { top_batsmen, top_bowlers } = data;

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex gap-3 glass-panel p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('batting')}
          className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'batting'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" /> Top Run Scorers (Batting)
        </button>
        <button
          onClick={() => setActiveTab('bowling')}
          className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'bowling'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Crosshair className="w-4 h-4" /> Top Wicket Takers (Bowling)
        </button>
      </div>

      {activeTab === 'batting' ? (
        /* Batting Leaderboard Table */
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
          <div className="p-5 border-b border-slate-800/80 flex justify-between items-center">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> IPL All-Time Top Run Scorers
            </h3>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              Calculated from ball-by-ball dataset
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-5">Rank</th>
                  <th className="py-3.5 px-5">Player</th>
                  <th className="py-3.5 px-5 text-right">Runs</th>
                  <th className="py-3.5 px-5 text-right">Balls</th>
                  <th className="py-3.5 px-5 text-right">Strike Rate</th>
                  <th className="py-3.5 px-5 text-right">Fours (4s)</th>
                  <th className="py-3.5 px-5 text-right">Sixes (6s)</th>
                  <th className="py-3.5 px-5 text-right">High Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {top_batsmen.map((player, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-xs text-slate-400 font-bold">#{idx + 1}</td>
                    <td className="py-3.5 px-5 font-semibold text-slate-100 flex items-center gap-2">
                      {idx === 0 && <span className="text-amber-400 font-bold text-xs">👑</span>}
                      {player.player}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-amber-400">{player.runs.toLocaleString()}</td>
                    <td className="py-3.5 px-5 text-right font-mono text-slate-300">{player.balls.toLocaleString()}</td>
                    <td className="py-3.5 px-5 text-right font-mono text-cyan-400">{player.strike_rate}</td>
                    <td className="py-3.5 px-5 text-right font-mono text-slate-300">{player.fours}</td>
                    <td className="py-3.5 px-5 text-right font-mono text-rose-400 font-semibold">{player.sixes}</td>
                    <td className="py-3.5 px-5 text-right font-mono text-slate-200">{player.highest_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Bowling Leaderboard Table */
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
          <div className="p-5 border-b border-slate-800/80 flex justify-between items-center">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> IPL All-Time Top Wicket Takers
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              Excludes non-credited dismissals
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-5">Rank</th>
                  <th className="py-3.5 px-5">Bowler</th>
                  <th className="py-3.5 px-5 text-right">Wickets</th>
                  <th className="py-3.5 px-5 text-right">Runs Conceded</th>
                  <th className="py-3.5 px-5 text-right">Overs Bowled</th>
                  <th className="py-3.5 px-5 text-right">Economy Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {top_bowlers.map((player, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-xs text-slate-400 font-bold">#{idx + 1}</td>
                    <td className="py-3.5 px-5 font-semibold text-slate-100 flex items-center gap-2">
                      {idx === 0 && <span className="text-emerald-400 font-bold text-xs">👑</span>}
                      {player.player}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-emerald-400 text-base">{player.wickets}</td>
                    <td className="py-3.5 px-5 text-right font-mono text-slate-300">{player.runs.toLocaleString()}</td>
                    <td className="py-3.5 px-5 text-right font-mono text-slate-300">{player.overs}</td>
                    <td className="py-3.5 px-5 text-right font-mono text-cyan-400 font-semibold">{player.economy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

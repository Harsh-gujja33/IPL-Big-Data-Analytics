import React, { useState } from 'react';
import { Search, Filter, Shield, Award, MapPin, Calendar, Layers } from 'lucide-react';

export default function MatchExplorer({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('All');

  if (!data || !data.team_stats) return null;

  const { team_stats, season_trends, overview } = data;

  // Filter teams based on search query
  const filteredTeams = team_stats.filter((team) =>
    team.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner & Search Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" /> Interactive IPL Dataset Explorer & Search Engine
          </h3>
          <p className="text-xs opacity-75 mt-1">
            Search across {overview.total_matches} matches, {overview.total_teams} franchises, and {overview.total_seasons} IPL seasons.
          </p>
        </div>

        {/* Search Input Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 opacity-50" />
            <input
              type="text"
              placeholder="Search team, e.g., Mumbai, Chennai, RCB..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-700/80 rounded-xl text-xs focus:outline-none focus:border-cyan-400 font-medium"
            />
          </div>

          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="px-3 py-2 bg-slate-900/60 border border-slate-700/80 rounded-xl text-xs focus:outline-none focus:border-cyan-400 cursor-pointer font-medium"
          >
            <option value="All">All Seasons ({overview.total_seasons})</option>
            {overview.seasons_list.map((s, idx) => (
              <option key={idx} value={s}>Season {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeams.map((team, idx) => (
          <div key={idx} className="glass-card p-5 rounded-2xl space-y-4 border border-slate-800">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base leading-snug">{team.team}</h4>
                  <span className="text-[11px] font-mono opacity-75">Franchise Statistics</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {team.win_pct}% Wins
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-center font-mono">
              <div className="bg-slate-900/50 p-2 rounded-xl">
                <span className="text-[10px] opacity-60 block uppercase">Played</span>
                <span className="text-sm font-bold text-slate-200">{team.played}</span>
              </div>
              <div className="bg-emerald-950/30 border border-emerald-500/20 p-2 rounded-xl">
                <span className="text-[10px] text-emerald-400 block uppercase">Wins</span>
                <span className="text-sm font-bold text-emerald-400">{team.wins}</span>
              </div>
              <div className="bg-rose-950/30 border border-rose-500/20 p-2 rounded-xl">
                <span className="text-[10px] text-rose-400 block uppercase">Losses</span>
                <span className="text-sm font-bold text-rose-400">{team.losses}</span>
              </div>
            </div>

            {/* Toss win ratio */}
            <div className="flex justify-between items-center text-xs opacity-80 pt-1">
              <span>Toss Wins Recorded:</span>
              <span className="font-mono font-bold text-amber-400">{team.toss_wins} times</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

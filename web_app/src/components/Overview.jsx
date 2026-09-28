import React from 'react';
import { Database, Shield, Flame, MapPin, Calendar, Activity } from 'lucide-react';

export default function Overview({ data }) {
  if (!data || !data.overview) return <div className="p-8 text-center text-slate-400">Loading dataset metrics...</div>;

  const { overview, team_stats } = data;

  const kpis = [
    { title: "Total Matches", value: overview.total_matches.toLocaleString(), icon: Activity, color: "from-cyan-500 to-blue-500" },
    { title: "Ball-by-Ball Deliveries", value: overview.total_deliveries.toLocaleString(), icon: Database, color: "from-amber-500 to-orange-500" },
    { title: "IPL Seasons", value: overview.total_seasons, icon: Calendar, color: "from-purple-500 to-indigo-500" },
    { title: "Franchise Teams", value: overview.total_teams, icon: Shield, color: "from-emerald-500 to-teal-500" },
    { title: "Stadium Venues", value: overview.total_venues, icon: MapPin, color: "from-rose-500 to-pink-500" },
    { title: "Total Runs Scored", value: overview.total_runs.toLocaleString(), icon: Flame, color: "from-yellow-400 to-amber-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Dynamic Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="glass-card p-5 rounded-2xl relative overflow-hidden group">
              <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${kpi.color} opacity-10 group-hover:opacity-25 transition-all blur-xl`}></div>
              <div className="flex items-center gap-4">
                <div className={`p-3.5 rounded-xl bg-gradient-to-br ${kpi.color} text-slate-950 font-bold shadow-lg shadow-black/40`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{kpi.title}</p>
                  <h3 className="text-2xl font-extrabold text-white mt-0.5 tracking-tight">{kpi.value}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Franchise Team Win Leaderboard */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" /> Franchise Wins Leaderboard
            </h3>
            <p className="text-xs text-slate-400 mt-1">Calculated directly from matches clean dataset ({overview.total_matches} matches)</p>
          </div>
          <span className="text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full">
            Dynamic Dataset Aggregation
          </span>
        </div>

        <div className="space-y-4">
          {team_stats.slice(0, 10).map((team, idx) => {
            const maxWins = team_stats[0].wins;
            const barWidth = `${(team.wins / maxWins) * 100}%`;

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-200 font-semibold">{team.team}</span>
                  <span className="text-slate-400 font-mono">
                    <strong className="text-cyan-400 font-bold">{team.wins}</strong> wins ({team.played} played • {team.win_pct}% win rate)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-700 shadow-md shadow-cyan-500/30"
                    style={{ width: barWidth }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

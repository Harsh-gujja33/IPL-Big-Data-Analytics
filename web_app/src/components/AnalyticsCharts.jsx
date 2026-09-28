import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import { PieChart as PieIcon, TrendingUp, Compass, Clock } from 'lucide-react';

export default function AnalyticsCharts({ data }) {
  if (!data) return null;

  const { toss_analysis, venue_stats, season_trends, phase_analysis } = data;

  // Toss Pie Data
  const tossPieData = [
    { name: "Toss Winner Won Match", value: toss_analysis.toss_match_wins, color: "#38bdf8" },
    { name: "Toss Winner Lost Match", value: data.overview.total_matches - toss_analysis.toss_match_wins, color: "#f43f5e" }
  ];

  // Phase Comparison Data
  const phaseData = [
    { phase: "Powerplay (1-6)", run_rate: phase_analysis.powerplay.run_rate, color: "#3b82f6" },
    { phase: "Middle Overs (7-15)", run_rate: phase_analysis.middle.run_rate, color: "#8b5cf6" },
    { phase: "Death Overs (16-20)", run_rate: phase_analysis.death.run_rate, color: "#ec4899" }
  ];

  return (
    <div className="space-y-8">
      {/* Top Row: Season Trends Line Chart & Toss Outcome Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Season Runs Trend */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" /> Season Runs Progression (2008 – 2026)
              </h3>
              <p className="text-xs text-slate-400 mt-1">Total runs aggregate calculated per IPL season</p>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
              {season_trends.length} Seasons
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={season_trends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="season" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
                <Line type="monotone" dataKey="runs" stroke="#c084fc" strokeWidth={3} dot={{ r: 4, fill: '#c084fc' }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Toss Outcome Pie Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-cyan-400" /> Toss Impact Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Toss winner match win rate: <strong className="text-cyan-400 font-bold">{toss_analysis.toss_match_win_pct}%</strong>
            </p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tossPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tossPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-around text-xs border-t border-slate-800 pt-3">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Won ({toss_analysis.toss_match_wins})
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Lost ({data.overview.total_matches - toss_analysis.toss_match_wins})
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Venue Distribution & Phase Run Rate Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stadium Venue Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" /> Top Stadium Venues
            </h3>
            <span className="text-xs text-slate-400">Matches Hosted</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={venue_stats} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="venue" type="category" stroke="#94a3b8" fontSize={10} width={130} tick={{ fill: '#cbd5e1' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
                <Bar dataKey="matches" fill="#f59e0b" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Phase Run Rate Comparison */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-400" /> Phase Run Rates (Powerplay vs Death)
            </h3>
            <span className="text-xs text-slate-400">Runs / Over</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={phaseData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="phase" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
                <Bar dataKey="run_rate" radius={[6, 6, 0, 0]}>
                  {phaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import analyticsData from './data/analytics_data.json';
import Stadium3D from './components/Stadium3D';
import Overview from './components/Overview';
import Leaderboards from './components/Leaderboards';
import AnalyticsCharts from './components/AnalyticsCharts';
import BdaConsole from './components/BdaConsole';
import MatchExplorer from './components/MatchExplorer';
import VivaPreparation from './components/VivaPreparation';
import { Activity, Award, BarChart3, Box, Terminal, Sparkles, Layers, Palette, Search, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('stadium3d');
  const [currentTheme, setCurrentTheme] = useState('midnight'); // midnight | royal | cyberpunk | emerald | light

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const navItems = [
    { id: 'stadium3d', label: '3D Stadium & Shots', icon: Box },
    { id: 'overview', label: 'Overview Metrics', icon: Activity },
    { id: 'leaderboards', label: 'Batting & Bowling', icon: Award },
    { id: 'analytics', label: 'Advanced Analytics', icon: BarChart3 },
    { id: 'matchexplorer', label: 'Franchise Search', icon: Search },
    { id: 'bdaconsole', label: 'BDA Concept Console', icon: Terminal },
    { id: 'vivaprep', label: 'Viva Prep Guide', icon: BookOpen },
  ];

  const themes = [
    { id: 'midnight', label: 'Midnight Dark 🌌' },
    { id: 'royal', label: 'IPL Royal Navy 👑' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon ⚡' },
    { id: 'emerald', label: 'Turf Emerald 🏏' },
    { id: 'light', label: 'Clean Daylight ☀️' },
  ];

  const getThemeGradient = () => {
    switch (currentTheme) {
      case 'royal':
        return 'from-amber-400 to-yellow-500 text-black shadow-amber-500/20';
      case 'cyberpunk':
        return 'from-pink-500 to-purple-600 text-white shadow-pink-500/20';
      case 'emerald':
        return 'from-emerald-400 to-teal-500 text-black shadow-emerald-500/20';
      case 'light':
        return 'from-blue-600 to-indigo-600 text-white shadow-blue-500/20';
      default:
        return 'from-cyan-500 to-blue-600 text-black shadow-cyan-500/20';
    }
  };

  const getActiveTabClass = () => {
    switch (currentTheme) {
      case 'royal':
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold shadow-md shadow-amber-500/20';
      case 'cyberpunk':
        return 'bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-md shadow-pink-500/20';
      case 'emerald':
        return 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold shadow-md shadow-emerald-500/20';
      case 'light':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20';
      default:
        return 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold shadow-md shadow-cyan-500/25';
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-500">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl font-extrabold shadow-lg ${getThemeGradient()}`}>
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight leading-snug">
                IPL Cricket Data Analytics
              </h1>
              <p className="text-xs opacity-75 font-mono flex items-center gap-2">
                <span>Hadoop • Hive • PySpark • React + Three.js</span>
              </p>
            </div>
          </div>

          {/* Theme Selector & Navigation */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Theme Selector Dropdown */}
            <div className="flex items-center gap-1.5 glass-panel p-1 rounded-xl">
              <Palette className="w-4 h-4 ml-2 opacity-70" />
              <select
                value={currentTheme}
                onChange={(e) => setCurrentTheme(e.target.value)}
                className="bg-transparent text-xs font-semibold px-2 py-1.5 focus:outline-none cursor-pointer rounded-lg border-0"
              >
                {themes.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-slate-100">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Navigation Buttons */}
            <nav className="flex flex-wrap gap-1 glass-panel p-1 rounded-xl">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? getActiveTabClass()
                        : 'opacity-70 hover:opacity-100 hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* Dataset Dynamic Banner */}
        <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 flex justify-between items-center text-xs opacity-90">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>
              Connected to Production Clean Datasets: <strong className="font-mono">{analyticsData.overview.total_matches}</strong> Matches | <strong className="font-mono">{analyticsData.overview.total_deliveries.toLocaleString()}</strong> Deliveries ({analyticsData.overview.total_seasons} Seasons)
            </span>
          </div>
          <span className="hidden md:inline font-mono text-[11px] opacity-75 bg-slate-800/60 px-3 py-1 rounded-md border border-slate-700">
            Active Theme: <span className="font-bold capitalize">{currentTheme}</span>
          </span>
        </div>

        {/* Tab View Content */}
        {activeTab === 'stadium3d' && (
          <div className="space-y-6">
            <Stadium3D />
            <Overview data={analyticsData} />
          </div>
        )}

        {activeTab === 'overview' && <Overview data={analyticsData} />}

        {activeTab === 'leaderboards' && <Leaderboards data={analyticsData} />}

        {activeTab === 'analytics' && <AnalyticsCharts data={analyticsData} />}

        {activeTab === 'matchexplorer' && <MatchExplorer data={analyticsData} />}

        {activeTab === 'bdaconsole' && <BdaConsole data={analyticsData} />}

        {activeTab === 'vivaprep' && <VivaPreparation />}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 mt-12 py-6 px-6 text-center text-xs opacity-75 font-mono">
        <p>IPL Cricket Data Analytics Using Hadoop, Hive and PySpark with an Interactive 3D Visualization Dashboard</p>
        <p className="text-[11px] opacity-60 mt-1">Academic Big Data Analytics (BDA) Course Project</p>
      </footer>
    </div>
  );
}

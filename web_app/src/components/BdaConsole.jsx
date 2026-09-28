import React, { useState } from 'react';
import { Terminal, FolderTree, Cpu, Database, Server, Play, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function BdaConsole({ data }) {
  const [activeConsoleTab, setActiveConsoleTab] = useState('mapreduce');
  const [mrStep, setMrStep] = useState(0);

  const mapReduceSteps = [
    {
      title: "1. Input Match CSV Line",
      code: "1082591,2017-04-05,2017,Hyderabad,Rajiv Gandhi Stadium,SRH,RCB,RCB,field,Sunrisers Hyderabad,...",
      desc: "Raw CSV record ingested from HDFS /ipl/clean/matches_clean.csv"
    },
    {
      title: "2. Mapper Phase (mapper.py)",
      code: "('Sunrisers Hyderabad', 1)\n('Mumbai Indians', 1)\n('Chennai Super Kings', 1)\n('Sunrisers Hyderabad', 1)",
      desc: "Mapper parses row, extracts winner team, and emits key-value tuple: (Team -> 1)"
    },
    {
      title: "3. Shuffle & Sort Phase (Hadoop Framework)",
      code: "'Sunrisers Hyderabad' => [1, 1, 1, 1, 1, ... 99 times]\n'Mumbai Indians' => [1, 1, 1, 1, ... 153 times]\n'Chennai Super Kings' => [1, 1, 1, ... 145 times]",
      desc: "Hadoop partitions and sorts tuples by key, grouping identical team keys together"
    },
    {
      title: "4. Reducer Phase (reducer.py)",
      code: "Sunrisers Hyderabad\t99\nMumbai Indians\t153\nChennai Super Kings\t145",
      desc: "Reducer sums list of 1s for each key to produce final match win count per team in HDFS"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Console Header Note */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <div>
            <h4 className="text-sm font-bold text-white">Big Data Analytics (BDA) Technology Explainer Console</h4>
            <p className="text-xs text-slate-400">Interactive visual demonstration of HDFS, MapReduce streaming, Hive HQL, and PySpark DataFrame pipelines for viva presentation.</p>
          </div>
        </div>
        <span className="text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full font-bold">
          Academic Viva Helper
        </span>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex flex-wrap gap-3 glass-panel p-1.5 rounded-xl">
        <button
          onClick={() => setActiveConsoleTab('mapreduce')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
            activeConsoleTab === 'mapreduce' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" /> MapReduce Dataflow
        </button>
        <button
          onClick={() => setActiveConsoleTab('hdfs')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
            activeConsoleTab === 'hdfs' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FolderTree className="w-4 h-4" /> HDFS Cluster Layout
        </button>
        <button
          onClick={() => setActiveConsoleTab('hive')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
            activeConsoleTab === 'hive' ? 'bg-purple-500 text-black shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" /> Hive SQL Queries
        </button>
        <button
          onClick={() => setActiveConsoleTab('pyspark')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
            activeConsoleTab === 'pyspark' ? 'bg-rose-500 text-black shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Server className="w-4 h-4" /> PySpark DataFrames
        </button>
      </div>

      {/* MapReduce Tab */}
      {activeConsoleTab === 'mapreduce' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-base">Hadoop MapReduce Step-by-Step Data Pipeline</h3>
            <button
              onClick={() => setMrStep((prev) => (prev + 1) % mapReduceSteps.length)}
              className="px-4 py-1.5 text-xs font-semibold bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <Play className="w-3.5 h-3.5" /> Next Pipeline Step ({mrStep + 1}/4)
            </button>
          </div>

          {/* Stepper visualizer */}
          <div className="grid grid-cols-4 gap-3">
            {mapReduceSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setMrStep(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mrStep === idx
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 font-bold'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <span className="text-[10px] font-mono block opacity-75">STEP 0{idx + 1}</span>
                <span className="text-xs truncate block mt-0.5">{step.title.split(' (')[0]}</span>
              </button>
            ))}
          </div>

          {/* Active Step Output Viewer */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold">{mapReduceSteps[mrStep].title}</span>
              <span>Input: /ipl/clean/matches_clean.csv</span>
            </div>
            <pre className="text-emerald-400 overflow-x-auto p-3 bg-slate-900/80 rounded-lg">
              {mapReduceSteps[mrStep].code}
            </pre>
            <p className="text-slate-300 font-sans text-xs flex items-center gap-2 pt-1">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> {mapReduceSteps[mrStep].desc}
            </p>
          </div>
        </div>
      )}

      {/* HDFS Tab */}
      {activeConsoleTab === 'hdfs' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base">HDFS Cluster Directory Hierarchy</h3>
          <p className="text-xs text-slate-400">Documented directory structures and file locations stored in HDFS distributed storage.</p>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
            <div className="text-amber-400 font-bold">/ipl/</div>
            <div className="pl-4 text-cyan-400">├── /raw/ <span className="text-slate-500 font-sans text-[11px]">(Original uploaded datasets)</span></div>
            <div className="pl-4 text-cyan-400">├── /clean/ <span className="text-slate-500 font-sans text-[11px]">(Cleaned production CSV files)</span></div>
            <div className="pl-8 text-emerald-400">├── matches_clean.csv <span className="text-slate-500 font-sans text-[11px]">({data.overview.total_matches} records)</span></div>
            <div className="pl-8 text-emerald-400">└── deliveries_clean.csv <span className="text-slate-500 font-sans text-[11px]">({data.overview.total_deliveries.toLocaleString()} records)</span></div>
            <div className="pl-4 text-cyan-400">├── /processed/ <span className="text-slate-500 font-sans text-[11px]">(Intermediate aggregation stages)</span></div>
            <div className="pl-4 text-cyan-400">└── /results/ <span className="text-slate-500 font-sans text-[11px]">(Output of MapReduce & Hive jobs)</span></div>
          </div>
        </div>
      )}

      {/* Hive Tab */}
      {activeConsoleTab === 'hive' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base">Apache Hive HQL Analytical Queries</h3>
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono text-xs text-purple-300 space-y-3">
            <div className="text-slate-400 border-b border-slate-800 pb-2">Hive Query: Top 10 Batsmen Aggregation</div>
            <pre className="text-purple-300 overflow-x-auto p-3 bg-slate-900/80 rounded-lg">
{`USE ipl_db;

SELECT 
    batter,
    SUM(batter_runs) AS total_runs,
    COUNT(CASE WHEN legal_ball = 1 THEN 1 END) AS balls_faced,
    ROUND((SUM(batter_runs) / COUNT(CASE WHEN legal_ball = 1 THEN 1 END)) * 100, 2) AS strike_rate
FROM deliveries
GROUP BY batter
ORDER BY total_runs DESC
LIMIT 10;`}
            </pre>
          </div>
        </div>
      )}

      {/* PySpark Tab */}
      {activeConsoleTab === 'pyspark' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base">PySpark DataFrames Distributed Processing</h3>
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono text-xs text-rose-300 space-y-3">
            <div className="text-slate-400 border-b border-slate-800 pb-2">Spark Transformation Pipeline: Team Wins Aggregation</div>
            <pre className="text-rose-300 overflow-x-auto p-3 bg-slate-900/80 rounded-lg">
{`from pyspark.sql import SparkSession
from pyspark.sql import functions as F

spark = SparkSession.builder.appName("IPL Big Data Analytics").getOrCreate()

matches_df = spark.read.csv("Dataset/ipl_matches_clean.csv", header=True, inferSchema=True)

team_wins = matches_df.filter(F.col("winner").isNotNull()) \\
    .groupBy("winner") \\
    .agg(F.count("match_id").alias("total_wins")) \\
    .orderBy(F.col("total_wins").desc())

team_wins.show(10)`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

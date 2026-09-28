import React, { useState } from 'react';
import { HelpCircle, CheckCircle, ChevronDown, ChevronUp, BookOpen, Award } from 'lucide-react';

export default function VivaPreparation() {
  const [openIdx, setOpenIdx] = useState(0);

  const vivaQuestions = [
    {
      category: "Hadoop HDFS",
      question: "What is HDFS and why is it used in this IPL Cricket analytics project?",
      answer: "Hadoop Distributed File System (HDFS) provides distributed, fault-tolerant storage for large-scale datasets. In this project, raw and cleaned IPL datasets (`matches_clean.csv` and `deliveries_clean.csv`) are stored in HDFS directories (/ipl/raw, /ipl/clean, /ipl/processed, /ipl/results), allowing MapReduce, Hive, and PySpark to perform distributed computations across clusters."
    },
    {
      category: "MapReduce Streaming",
      question: "Explain the Mapper, Shuffle & Sort, and Reducer stages in your team wins MapReduce job.",
      answer: "1. Mapper (mapper.py): Ingests match rows from stdout, parses the CSV, extracts the winner team string, and emits key-value pairs (Team_Name \\t 1).\n2. Shuffle & Sort: Hadoop framework automatically groups and sorts all identical team keys together.\n3. Reducer (reducer.py): Receives grouped streams of 1s for each team key and calculates the total match win count per franchise."
    },
    {
      category: "Hive vs SQL",
      question: "How does Apache Hive differ from traditional relational databases like MySQL?",
      answer: "Hive is a data warehouse software built on top of Hadoop for querying and managing large datasets residing in distributed storage using HQL (Hive Query Language). Unlike traditional RDBMS, Hive uses Schema-on-Read, converts queries into distributed MapReduce/Tez jobs, and scales to petabytes."
    },
    {
      category: "PySpark DataFrames",
      question: "Why is PySpark preferred over MapReduce for complex exploratory analytics?",
      answer: "PySpark processes data in-memory (RAM) using Resilient Distributed Datasets (RDDs) and DataFrames, making it up to 100x faster than disk-based MapReduce. PySpark DataFrames provide built-in optimization (Catalyst Optimizer) and rich functional APIs for grouping, filtering, and joining ball-by-ball delivery datasets."
    },
    {
      category: "Cricket Statistics Formulas",
      question: "How are Strike Rate, Economy Rate, and Bowler Wickets calculated in this pipeline?",
      answer: "• Strike Rate = (Total Runs Scored / Legal Balls Faced) × 100\n• Economy Rate = Runs Conceded / (Legal Balls Bowled / 6.0)\n• Bowler Wickets = Only credited dismissals (caught, bowled, lbw, stumped, caught & bowled, hit wicket) are counted. Uncredited dismissals like run-outs and retired hurt are excluded."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 bg-amber-950/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-amber-400" />
          <div>
            <h3 className="text-lg font-bold text-white">BDA Academic Viva Defense Preparation & Concept Guide</h3>
            <p className="text-xs opacity-75 mt-0.5">Key theoretical concepts, architectural rationale, and cricket formula explanations for faculty viva examination.</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
          Viva Defense Prep
        </span>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-4">
        {vivaQuestions.map((q, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="glass-panel rounded-2xl overflow-hidden border border-slate-800 transition-all">
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full p-5 text-left flex justify-between items-center hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {q.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-100">{q.question}</h4>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 opacity-70" /> : <ChevronDown className="w-4 h-4 opacity-70" />}
              </button>

              {isOpen && (
                <div className="p-5 pt-0 border-t border-slate-800/60 text-xs leading-relaxed opacity-90 font-mono whitespace-pre-line bg-slate-950/40 text-slate-300">
                  <div className="flex items-start gap-2 pt-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{q.answer}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

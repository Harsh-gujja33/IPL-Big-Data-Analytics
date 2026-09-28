# IPL Cricket Data Analytics Using Hadoop, Hive and PySpark with an Interactive 3D Visualization Dashboard

Academic Big Data Analytics (BDA) Course Project.

## Project Overview

This project implements an end-to-end Big Data Analytics pipeline for IPL match-level and ball-by-ball cricket data. It features dataset validation and preprocessing with Python, distributed storage with Hadoop HDFS, distributed aggregation with MapReduce, SQL-based querying with Apache Hive, and large-scale analytical processing with PySpark. The insights are presented via an interactive React + Three.js 3D Web Application and standalone Matplotlib visualizations.

---

## System Architecture

```text
                    IPL DATASET
                         │
             ┌───────────┴───────────┐
             │                       │
       Matches CSV             Ball-by-Ball CSV
             │                       │
             └───────────┬───────────┘
                         ↓
              Python Validation
              & Preprocessing
                         ↓
                       HDFS
                         │
             ┌───────────┼───────────┐
             ↓           ↓           ↓
         MapReduce      Hive       PySpark
             │           │           │
             └───────────┼───────────┘
                         ↓
                  Analytics Results
                         ↓
                 analytics_data.json
                         ↓
                React + Three.js
                         ↓
              ┌──────────┼──────────┐
              ↓          ↓          ↓
          Dashboard    BDA Console  3D Stadium
              │          │          │
              └──────────┼──────────┘
                         ↓
                 IPL Insights
```

---

## Directory Layout

```text
BDA Course Project/
│
├── Dataset/
│   ├── ipl_matches_clean.csv
│   └── ipl_ball_by_ball_clean.csv
│
├── preprocessing/
│   └── data_cleaning.py          # Validation, Preprocessing & Analytics Generator
│
├── hdfs/
│   └── hdfs_commands.txt         # Documented HDFS operations & directory structure
│
├── mapreduce/
│   ├── mapper.py                 # Streaming MapReduce mapper
│   ├── reducer.py                # Streaming MapReduce reducer
│   └── README.md                 # Viva defense guide
│
├── hive/
│   ├── create_database.hql       # Hive ipl_db DDL
│   ├── create_tables.hql         # External table schemas
│   └── analysis_queries.hql      # Analytical HQL queries
│
├── pyspark/
│   ├── ipl_analysis.py           # PySpark DataFrames pipeline
│   └── eda.py                    # PySpark EDA script
│
├── visualization/
│   ├── generate_charts.py        # Standalone Matplotlib chart generator
│   └── charts/                   # Output PNG charts
│
├── web_app/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Stadium3D.jsx     # Three.js 3D Stadium & Shot Visualizer
│   │   │   ├── Overview.jsx      # Dynamic KPI cards & Team Wins
│   │   │   ├── Leaderboards.jsx  # Batting & Bowling tables
│   │   │   ├── AnalyticsCharts.jsx # Toss, Venue, Season, Phase charts
│   │   │   └── BdaConsole.jsx    # Viva Explainer for HDFS, MapReduce, Hive, PySpark
│   │   ├── data/
│   │   │   └── analytics_data.json # Programmatically generated analytics
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── architecture.md
├── design.md                     # Fixed naming
├── phases.md                     # Fixed naming
├── .cursorrules
├── requirements.txt
└── README.md
```

---

## How to Run the Project

### 1. Data Validation & Preprocessing
```bash
python preprocessing/data_cleaning.py
```
Validates match ID integrity, computes exact cricket statistics (using `legal_ball` counts for run rates), and exports `web_app/src/data/analytics_data.json`.

### 2. Standalone Matplotlib Charts Generation
```bash
python visualization/generate_charts.py
```
Generates 6 PNG charts under `visualization/charts/`.

### 3. Local MapReduce Test (PowerShell / Bash)
```powershell
Get-Content Dataset/ipl_matches_clean.csv | python mapreduce/mapper.py | sort | python mapreduce/reducer.py

```bash
type Dataset\ipl_matches_clean.csv | python mapreduce\mapper.py | sort | python mapreduce\reducer.py

### 4. Interactive 3D Web Dashboard
```bash
cd web_app
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Data Accuracy & Integrity Guarantee
- **No Hardcoded Numbers**: All statistics displayed in the 3D Web Application and Matplotlib charts are calculated dynamically from `Dataset/ipl_matches_clean.csv` (1,212 matches) and `Dataset/ipl_ball_by_ball_clean.csv` (288,226 deliveries).
- **Exact Run Rates**: Calculated using legal balls (`legal_ball == 1`) to ensure strict cricket statistical standards.

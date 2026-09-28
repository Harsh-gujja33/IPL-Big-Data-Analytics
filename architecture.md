# IPL Cricket Data Analytics - System Architecture

## 1. Overview

The IPL Cricket Data Analytics project is an academic Big Data processing and analytics pipeline designed to process IPL match-level and ball-by-ball cricket data.

The system uses Python for dataset validation and preprocessing, Hadoop HDFS for distributed storage, MapReduce for distributed aggregation, Hive for SQL-based analytics, PySpark for scalable exploratory and advanced data analysis, and a React + Three.js Web Application as the interactive 3D visualization layer.

---

## 2. System Architecture Diagram

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

## 3. Data Sources

The project uses the following IPL datasets in `Dataset/`:

* `ipl_matches_clean.csv` (1,212 matches, 14 columns)
* `ipl_ball_by_ball_clean.csv` (288,226 ball-by-ball deliveries, 50 columns)

---

## 4. Data Layer & Validation Engine

Python script `preprocessing/data_cleaning.py` performs explicit dataset validation:
- Validates 0 duplicates and zero missing key fields.
- Verifies 100% match ID relationship integrity between match records and ball-by-ball deliveries.
- Calculates exact cricket metrics using `legal_ball` counts for season and match phase run rates.
- Programmatically exports analytics to `web_app/src/data/analytics_data.json`.

---

## 5. Distributed Storage & Processing Pipeline

### 5.1 Storage Layer - HDFS
Documented in `hdfs/hdfs_commands.txt`:
- `/ipl/raw`
- `/ipl/clean`
- `/ipl/processed`
- `/ipl/results`

### 5.2 MapReduce Streaming
Implemented in `mapreduce/mapper.py` and `mapreduce/reducer.py`:
- Map Phase: Parses match records and emits `(Team -> 1)`.
- Shuffle & Sort Phase: Hadoop partitions and groups team keys.
- Reduce Phase: Sums team match win counts.

### 5.3 Hive SQL Analytical Layer
Defined in `hive/`:
- Database DDL: `create_database.hql` (`ipl_db`).
- Table Schemas: `create_tables.hql` (`matches` and `deliveries`).
- Queries: `analysis_queries.hql` (Descriptive stats, JOIN, GROUP BY, STDDEV).

### 5.4 PySpark Scalable DataFrames Engine
Implemented in `pyspark/`:
- `ipl_analysis.py`: PySpark DataFrames transformation pipeline.
- `eda.py`: Schema validation & summary stats.

---

## 6. Interactive 3D Web Application & Visualization Layer

Built in `web_app/` using React + Vite + Three.js:
- **`Stadium3D.jsx`**: Interactive 3D Stadium geometry (pitch, outfield, stumps, floodlights, 4 camera angles, 3D boundary shot curves).
- **`Overview.jsx`**: Dynamic KPI cards & franchise wins leaderboard.
- **`Leaderboards.jsx`**: Batting and Bowling leaderboards.
- **`AnalyticsCharts.jsx`**: Toss, venue, season trend, and phase comparison charts.
- **`BdaConsole.jsx`**: Viva Concept Explainer for HDFS, MapReduce dataflow, Hive, and PySpark.

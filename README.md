# 🏏 IPL Cricket Data Analytics Using Big Data Technologies

<p align="center">
  <strong>Big Data Analytics Course Project</strong>
</p>

<p align="center">
  An end-to-end IPL cricket analytics platform using Hadoop, MapReduce, Hive, PySpark, and R Shiny.
</p>

---

## 📌 Project Overview

The **IPL Cricket Data Analytics Using Big Data Technologies** project analyzes Indian Premier League (IPL) match-level and ball-by-ball cricket data using Big Data technologies.

The project demonstrates how cricket data can be:

- Collected and preprocessed
- Stored using Hadoop HDFS
- Processed using MapReduce
- Queried using Apache Hive
- Analyzed using PySpark
- Visualized through an interactive R Shiny dashboard

The system provides insights into **team performance, player performance, batting, bowling, venues, match phases, and overall IPL statistics**.

---

## 🎯 Objectives

The main objectives of this project are:

- Analyze IPL match-level and ball-by-ball data.
- Demonstrate distributed storage using **Hadoop HDFS**.
- Perform distributed processing using **MapReduce**.
- Perform SQL-based analysis using **Apache Hive**.
- Perform large-scale data processing using **PySpark**.
- Build an interactive analytics dashboard using **R Shiny**.
- Analyze team and player performance.
- Analyze batting and bowling statistics.
- Analyze venue-wise performance.
- Analyze performance across different match phases.
- Provide an interactive interface for exploring IPL data.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │     IPL Dataset      │
                    │ Match + Ball-by-Ball │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Data Preprocessing    │
                    │ Cleaning & Formatting │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Hadoop HDFS     │
                    │ Distributed Storage   │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
         ┌────────────┐ ┌────────────┐ ┌────────────┐
         │ MapReduce  │ │    Hive    │ │  PySpark   │
         │ Processing │ │ SQL Query  │ │ Analytics  │
         └──────┬─────┘ └──────┬─────┘ └──────┬─────┘
                │              │              │
                └──────────────┼──────────────┘
                               ▼
                    ┌──────────────────────┐
                    │ Processed Analytics  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     R Shiny App      │
                    │ Interactive Dashboard│
                    └──────────────────────┘
🔄 Data Processing Pipeline
Raw IPL Data
     │
     ▼
Data Preprocessing
     │
     ▼
Clean IPL Dataset
     │
     ▼
Hadoop HDFS
     │
     ├──────────────► MapReduce
     │
     ├──────────────► Hive
     │
     └──────────────► PySpark
                      │
                      ▼
               Analytical Results
                      │
                      ▼
                R Shiny Dashboard
🛠️ Technologies Used
Technology	Purpose
Hadoop HDFS	Distributed storage of IPL datasets
MapReduce	Distributed data processing
Apache Hive	SQL-based querying and analysis
PySpark	Large-scale data processing and analytics
R	Data analysis and visualization
R Shiny	Interactive dashboard
ggplot2	Data visualization
dplyr	Data manipulation
DT	Interactive data tables
Python	MapReduce and PySpark processing
Git & GitHub	Version control and project hosting
📊 Dataset

The project works with two major types of IPL data.

1. Match-Level Dataset

The match dataset contains information about individual IPL matches, including:

Match ID
Season
Date
Teams
Venue
Toss information
Match result
Winner
Player of the Match
Other match-related information
2. Ball-by-Ball Dataset

The ball-by-ball dataset contains delivery-level information, including:

Match ID
Batting team
Bowling team
Over and ball information
Batter
Bowler
Runs scored
Extras
Wickets
Dismissal information
Dataset Size

The processed dataset used by the project contains approximately:

Dataset	Records
Match-Level Data	1,212
Ball-by-Ball Data	288,226

The raw dataset is excluded from the repository to keep the repository size manageable. The processed/clean dataset is included.

🧹 Data Preprocessing

Before analysis, the IPL datasets are cleaned and prepared for Big Data processing.

The preprocessing stage includes:

Handling missing values
Removing unnecessary columns
Standardizing column names
Formatting data types
Cleaning team and player names
Preparing match-level data
Preparing delivery-level data

The cleaned datasets are then used for subsequent Hadoop, Hive, MapReduce, PySpark, and visualization operations.

⚙️ Big Data Processing
Hadoop HDFS

Hadoop Distributed File System (HDFS) is used as the distributed storage layer.

It provides storage for the IPL datasets and demonstrates the distributed storage concept of the Hadoop ecosystem.

MapReduce

MapReduce is used to demonstrate distributed processing.

Mapper

The Mapper processes individual input records and produces intermediate key-value pairs.

Reducer

The Reducer receives intermediate results and performs aggregation.

MapReduce can be used for operations such as:

Counting matches
Aggregating team statistics
Calculating cricket-related statistics
Processing large datasets
Apache Hive

Apache Hive provides a SQL-like interface for querying IPL data.

Example query:

SELECT winner, COUNT(*)
FROM matches
GROUP BY winner;

Hive makes structured analysis easier through SQL-style queries.

PySpark

PySpark is used for distributed data processing and analytics.

Typical operations include:

Filtering
Grouping
Aggregation
Statistical analysis
Team performance analysis
Player performance analysis
📈 Interactive R Shiny Dashboard

The processed IPL data is presented through an interactive R Shiny dashboard.

The dashboard allows users to explore IPL statistics dynamically.

Dashboard Sections
🏠 Dashboard

Provides an overall view of the IPL dataset and major statistics.

🏆 Team Analysis

Analyze:

Matches played
Matches won
Win percentage
Team performance
Season-wise performance
👤 Player Analysis

Explore player-level statistics and performance.

🏏 Batting Analysis

Analyze:

Runs
Batting performance
Scoring patterns
Player statistics
🎯 Bowling Analysis

Analyze:

Wickets
Bowling performance
Bowling statistics
Player performance
🏟️ Venue Analysis

Analyze IPL matches based on venues and grounds.

⏱️ Phase Analysis

Analyze performance across different match phases:

Powerplay
Middle overs
Death overs
📋 Data Explorer

Provides an interactive view of the underlying datasets.

ℹ️ About

Provides information about the project, technologies, methodology, and dataset.

📁 Project Structure
IPL-Big-Data-Analytics/
│
├── Dataset/
│   └── clean/
│       ├── ipl_ball_by_ball_clean.csv
│       └── ipl_matches_clean.csv
│
├── R_Shiny/
│   └── app.R
│
├── hdfs/
│   └── HDFS-related files
│
├── hive/
│   └── Hive queries and scripts
│
├── mapreduce/
│   ├── mapper.py
│   └── reducer.py
│
├── preprocessing/
│   └── Data preprocessing scripts
│
├── pyspark/
│   └── PySpark analysis scripts
│
├── visualization/
│   └── Visualization-related files
│
├── web_app/
│   └── Web application files
│
├── architecture.md
├── design.md
├── phases.md
└── README.md
💻 Running the R Shiny Dashboard
Prerequisites

Install:

R
RStudio (optional)
Required R packages
Install Required Packages

Run the following in R:

install.packages("shiny")
install.packages("ggplot2")
install.packages("dplyr")
install.packages("DT")
install.packages("tidyr")
install.packages("scales")
Start the Dashboard

From the project root:

cd R_Shiny

Run:

Rscript -e "shiny::runApp('.', host='127.0.0.1', port=3838)"

The dashboard will be available at:

http://127.0.0.1:3838

To stop the application:

Ctrl + C
🖥️ Development Environment

The project was developed and tested on Windows using:

Java JDK
Hadoop
HDFS
MapReduce
Hive
PySpark
Python
R
R Shiny
📚 Big Data Concepts Demonstrated

This project demonstrates several important Big Data concepts.

Volume

IPL generates a large number of delivery-level records across multiple seasons.

Variety

The project works with both match-level and detailed ball-by-ball data.

Velocity

Ball-by-ball records represent sequential events generated throughout IPL matches.

Distributed Storage

HDFS is used for distributed dataset storage.

Distributed Processing

MapReduce and PySpark are used for processing and analyzing the data.

Data Warehousing

Hive provides a SQL-based approach for querying structured IPL data.

Data Visualization

R Shiny presents analytical results through an interactive dashboard.

🎓 Academic Learning Outcomes

Through this project, the following concepts were implemented practically:

Hadoop ecosystem
HDFS
MapReduce
Apache Hive
PySpark
Data preprocessing
Distributed data processing
Data aggregation
Exploratory data analysis
Data visualization
Interactive dashboards
Big Data architecture
🚀 Future Enhancements

Possible future enhancements include:

Real-time IPL data updates
Predictive analytics
Player performance prediction
Match outcome prediction
Advanced machine learning models
Additional interactive visualizations
Automated dataset updates
Cloud-based deployment
Advanced statistical analysis
👨‍💻 Author

Harsh Gujja

BE Computer Engineering
Vidyavardhini's College of Engineering and Technology

GitHub

🔗 https://github.com/Harsh-gujja33

LinkedIn

🔗 https://www.linkedin.com/in/harsh-gujja-01bb45318/

📌 Project Information

Project Title:
IPL Cricket Data Analytics Using Big Data Technologies

Domain:
Big Data Analytics

Project Type:
Academic Course Project

Primary Technologies:
Hadoop • HDFS • MapReduce • Hive • PySpark • R Shiny

⭐ Acknowledgement

This project was developed as part of the Big Data Analytics course to demonstrate the practical implementation of Big Data storage, processing, analysis, and visualization techniques using IPL cricket data.

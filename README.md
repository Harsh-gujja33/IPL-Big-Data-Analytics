# 🏏 IPL Cricket Data Analytics Using Big Data Technologies

A Big Data Analytics project for analyzing Indian Premier League (IPL) cricket data using **Hadoop HDFS, MapReduce, Apache Hive, PySpark, and R Shiny**.

The project processes IPL match-level and ball-by-ball data to extract meaningful insights about teams, players, batting, bowling, venues, match phases, and overall team performance.

---

## 📌 Project Overview

The Indian Premier League generates a large amount of cricket data across multiple seasons. Analyzing this data manually becomes difficult as the volume and complexity of the data increase.

This project demonstrates how **Big Data technologies** can be used to store, process, analyze, and visualize IPL cricket data.

The complete workflow is:

```text
Raw IPL Dataset
       ↓
Data Preprocessing
       ↓
Hadoop HDFS
       ↓
MapReduce
       ↓
Hive
       ↓
PySpark
       ↓
R Shiny Dashboard
       ↓
Interactive IPL Analytics
🎯 Objectives
Analyze IPL match and ball-by-ball data.
Demonstrate distributed data storage using Hadoop HDFS.
Perform distributed processing using MapReduce.
Perform SQL-based analysis using Apache Hive.
Perform advanced data processing using PySpark.
Create an interactive analytics dashboard using R Shiny.
Analyze team and player performance.
Analyze batting and bowling statistics.
Analyze venue-wise and phase-wise performance.
Provide an easy-to-use interface for exploring IPL data.
🛠️ Technologies Used
Technology	Purpose
Hadoop HDFS	Distributed storage of IPL datasets
MapReduce	Distributed processing of data
Apache Hive	SQL-based querying and analysis
PySpark	Large-scale data processing and analytics
R	Data analysis and visualization
R Shiny	Interactive web dashboard
ggplot2	Data visualization
dplyr	Data manipulation
DT	Interactive data tables
Python	MapReduce and PySpark processing
Git/GitHub	Version control and project hosting
📊 Dataset

The project uses IPL cricket datasets containing:

1. Match-Level Data

Contains information about individual IPL matches, including:

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
2. Ball-by-Ball Data

Contains delivery-level information from IPL matches, including:

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

The processed dataset used by the dashboard contains approximately:

1,212 match records
288,226 ball-by-ball delivery records

The raw dataset is excluded from this repository to keep the repository size manageable. The processed/clean dataset is included where applicable.

🏗️ Project Architecture
                 IPL Dataset
                     │
                     ▼
            Data Preprocessing
                     │
                     ▼
              ┌─────────────┐
              │   HDFS      │
              │  Storage    │
              └─────────────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
      MapReduce     Hive      PySpark
          │          │          │
          └──────────┼──────────┘
                     ▼
                Processed Data
                     │
                     ▼
                R Shiny App
                     │
                     ▼
            Interactive Dashboard
🔄 Data Processing Pipeline
1. Data Collection

IPL match and ball-by-ball datasets are collected from publicly available cricket datasets.

2. Data Preprocessing

The raw data is cleaned and prepared for analysis.

Major preprocessing operations include:

Handling missing values
Removing unnecessary columns
Standardizing column names
Formatting data types
Cleaning team and player names
Preparing match and delivery-level datasets
3. HDFS Storage

The processed datasets are stored in Hadoop Distributed File System (HDFS).

HDFS provides distributed and fault-tolerant storage for large datasets.

4. MapReduce

MapReduce is used to demonstrate distributed processing.

The:

Mapper processes input records.
Reducer combines and aggregates intermediate results.

This can be used for operations such as counting matches, calculating team statistics, and aggregating cricket data.

5. Hive Analysis

Apache Hive provides a SQL-like interface for analyzing the IPL datasets.

Example operations include:

SELECT winner, COUNT(*)
FROM matches
GROUP BY winner;

Hive makes it easier to perform structured queries on large datasets.

6. PySpark Analysis

PySpark is used for distributed data processing and analytics.

Typical operations include:

Filtering
Grouping
Aggregation
Statistical analysis
Team performance analysis
Player performance analysis
7. R Shiny Dashboard

The processed data is visualized through an interactive R Shiny dashboard.

Users can select teams and seasons and explore different aspects of IPL performance.

📈 Dashboard Features

The R Shiny dashboard contains multiple analytical sections.

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

Analyze match performance across different phases such as:

Powerplay
Middle overs
Death overs
📋 Data Explorer

Provides an interactive view of the underlying datasets.

ℹ️ About

Contains information about the project, technologies, methodology, and dataset.

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

Install the following:

R
RStudio (optional)
Required R packages

Install the required packages:

install.packages("shiny")
install.packages("ggplot2")
install.packages("dplyr")
install.packages("DT")
install.packages("tidyr")
install.packages("scales")
Start the Dashboard

Open Command Prompt and navigate to the R Shiny directory:

cd "C:\Users\gujja\Desktop\BDA Course Project\R_Shiny"

Run:

Rscript -e "shiny::runApp('.', host='127.0.0.1', port=3838)"

The dashboard will be available at:

http://127.0.0.1:3838

To stop the application:

Ctrl + C
🖥️ Hadoop Environment

The project was developed and tested on Windows using:

Hadoop
Java JDK
HDFS
MapReduce
Hive
PySpark
R

Hadoop is used to demonstrate distributed storage and processing concepts required for the Big Data Analytics project.

📚 Big Data Concepts Demonstrated

This project demonstrates the following Big Data concepts:

Volume

IPL generates a large number of delivery-level records across multiple seasons.

Variety

The project contains both structured match-level and detailed ball-by-ball data.

Velocity

The ball-by-ball dataset represents sequential events generated throughout matches.

Distributed Storage

HDFS is used for storing large datasets.

Distributed Processing

MapReduce and PySpark are used for processing and analyzing the data.

Data Warehousing

Hive provides a SQL-based approach for querying the data.

Data Visualization

R Shiny converts analytical results into an interactive dashboard.

🎓 Academic Learning Outcomes

Through this project, the following concepts were implemented practically:

Hadoop ecosystem
HDFS
MapReduce
Hive
PySpark
Data preprocessing
Distributed data processing
Data aggregation
Exploratory data analysis
Data visualization
Interactive dashboards
Big Data architecture
🚀 Future Enhancements

Possible future improvements include:

Adding real-time IPL data updates
Adding predictive analytics
Player performance prediction
Match outcome prediction
Advanced machine learning models
More interactive visualizations
Automated dataset updates
Cloud-based deployment
Advanced statistical analysis
👨‍💻 Author

Harsh Gujja

BE Computer Engineering
Vidyavardhini's College of Engineering and Technology

GitHub:
https://github.com/Harsh-gujja33

LinkedIn:
https://www.linkedin.com/in/harsh-gujja-01bb45318/

📌 Project

IPL Cricket Data Analytics Using Big Data Technologies

Academic Big Data Analytics Course Project


### One small recommendation

Because your actual GitHub repository is now working, you can update the README directly from CMD later with:

```cmd
cd "C:\Users\gujja\Desktop\BDA Course Project"
notepad README.md

Paste the content, save it, then:

git add README.md
git commit -m "Improve project README"
git push

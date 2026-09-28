\# IPL Cricket Data Analytics - Detailed Design



\## 1. Project Objective



The objective is to design a Big Data analytics system that processes IPL match-level and ball-by-ball data and extracts useful cricket statistics using Hadoop ecosystem technologies.



The system focuses on:



\* Team performance

\* Player performance

\* Match statistics

\* Toss analysis

\* Venue analysis

\* Season trends

\* Ball-by-ball analysis



\---



\# 2. Functional Requirements



\## FR-01: Dataset Loading



The system shall load IPL match-level and ball-by-ball datasets.



Supported primary datasets:



\* IPL Matches Clean

\* IPL Ball by Ball Clean



\---



\## FR-02: Data Inspection



The system shall inspect:



\* Number of records

\* Columns

\* Data types

\* Missing values

\* Duplicate records

\* Unique teams

\* Unique players

\* Seasons



\---



\## FR-03: Data Cleaning



The system shall identify and handle:



\* Missing values

\* Duplicate records

\* Inconsistent names

\* Invalid IDs

\* Incorrect data types



Original data must remain unchanged.



\---



\## FR-04: HDFS Storage



The system shall store cleaned IPL datasets in HDFS.



Example:



```text

/ipl/clean/matches\_clean.csv

/ipl/clean/deliveries\_clean.csv

```



\---



\## FR-05: MapReduce Processing



The system shall implement at least one meaningful MapReduce task.



Primary task:



> Calculate the number of matches won by each team.



Input:



```text

Match dataset

```



Output:



```text

Team -> Total Wins

```



\---



\## FR-06: Hive Analytics



Hive shall provide SQL-based analysis.



Required operations:



\* COUNT

\* GROUP BY

\* ORDER BY

\* AVG

\* MIN

\* MAX

\* STDDEV

\* WHERE

\* JOIN where applicable



\---



\## FR-07: PySpark Analytics



PySpark shall process IPL data using Spark DataFrames.



Required operations:



\* Data loading

\* Filtering

\* Grouping

\* Aggregation

\* Sorting

\* Joining



\---



\# 3. Analytical Requirements



\## A-01: Team Performance



Calculate:



```text

Matches Played

Matches Won

Matches Lost

Win Percentage

```



\---



\## A-02: Top Batsmen



Calculate:



```text

Player

Total Runs

Fours

Sixes

Strike Rate

```



\---



\## A-03: Top Bowlers



Calculate:



```text

Player

Wickets

Runs Conceded

Economy Rate

```



Only dismissals credited to the bowler should be included when calculating bowler wickets.



\---



\## A-04: Toss Analysis



Calculate:



```text

Total Tosses

Toss Winner Also Won Match

Percentage

```



Also analyze:



```text

Toss Decision

Bat First

Field First

```



\---



\## A-05: Venue Analysis



Calculate:



\* Number of matches per venue

\* Average runs per venue

\* Team performance by venue



\---



\## A-06: Season Analysis



Calculate:



\* Matches per season

\* Total runs per season

\* Total wickets per season

\* Team performance by season



\---



\## A-07: Powerplay Analysis



Analyze overs:



```text

1–6

```



Calculate:



\* Runs

\* Average runs

\* Team performance



\---



\## A-08: Death Over Analysis



Analyze overs:



```text

16–20

```



Calculate:



\* Runs

\* Average runs

\* Best scoring teams

\* Best scoring players where applicable



\---



\# 4. Non-Functional Requirements



\## Performance



Use Spark DataFrames for scalable analytical operations.



Avoid unnecessary conversion of the complete dataset into Pandas.



\---



\## Reliability



The system should:



\* Validate input files

\* Check schemas

\* Handle missing values

\* Avoid overwriting raw data

\* Produce reproducible outputs



\---



\## Maintainability



Code should be divided into:



```text

Preprocessing

HDFS

MapReduce

Hive

PySpark

Visualization

```



\---



\## Explainability



Every major analytical result should be explainable using:



1\. Input data

2\. Processing method

3\. Formula/query

4\. Result

5\. Interpretation



\---



\# 5. Data Model



\## Match Entity



```text

Match

\---------------------

match\_id

season

date

team1

team2

toss\_winner

toss\_decision

winner

venue

player\_of\_match

result

margin

```



Actual fields depend on the dataset schema.



\---



\## Delivery Entity



```text

Delivery

\---------------------

match\_id

inning

over

ball

batting\_team

bowling\_team

batter

bowler

batsman\_runs

extra\_runs

total\_runs

is\_wicket

dismissal\_kind

```



Actual fields depend on the dataset schema.



\---



\# 6. Relationship



```text

Match

&#x20; |

&#x20; | 1

&#x20; |

&#x20; |-------------------<

&#x20; |

Delivery

&#x20; \*

```



One match can contain many delivery records.



The relationship is established through the match identifier.



\---



\# 7. Processing Design



\## Stage 1 - Ingestion



```text

CSV

&#x20;↓

Python

```



\---



\## Stage 2 - Cleaning



```text

Raw CSV

&#x20;↓

Validation

&#x20;↓

Clean CSV

```



\---



\## Stage 3 - HDFS



```text

Clean CSV

&#x20;↓

HDFS

```



\---



\## Stage 4 - Distributed Processing



```text

&#x20;            HDFS

&#x20;              |

&#x20;      +-------+-------+

&#x20;      |       |       |

&#x20;      v       v       v

&#x20;  MapReduce Hive   PySpark

```



\---



\## Stage 5 - Results



```text

Processed Data

&#x20;     ↓

Aggregated Statistics

&#x20;     ↓

CSV / HDFS Results

```



\---



\## Stage 6 - Visualization



```text

Results

&#x20;  ↓

Python

&#x20;  ↓

Matplotlib

&#x20;  ↓

Charts

```



\---



\# 8. Directory Design



```text

ipl-bda-project/



data/

├── raw/

├── clean/

└── processed/



preprocessing/

└── data\_cleaning.py



hdfs/

└── hdfs\_commands.txt



mapreduce/

├── mapper.py

└── reducer.py



hive/

├── create\_database.hql

├── create\_tables.hql

└── analysis\_queries.hql



pyspark/

├── ipl\_analysis.py

└── eda.py



visualization/

└── charts/



results/



docs/

├── architecture.md

├── design.md

└── phases.md

```



\---



\# 9. Error Handling Design



Before processing:



```text

Check file exists

&#x20;      ↓

Check schema

&#x20;      ↓

Check required columns

&#x20;      ↓

Check data types

&#x20;      ↓

Process

```



If a required column is missing, stop execution and provide a clear error.



Do not silently produce incorrect results.



\---



\# 10. Security



This is an academic local analytics project.



No user authentication or sensitive personal data is required.



No credentials should be hardcoded into source code.



If MySQL or MongoDB is used, credentials should be stored outside the source code.



\---



\# 11. Scalability Design



Although the IPL dataset can be processed on a normal computer, the project uses Hadoop and Spark to demonstrate a pipeline that can scale to larger datasets.



The architecture should allow additional seasons or larger cricket datasets to be added without redesigning the analytical pipeline.



\---



\# 12. MVP Design



The MVP contains:



```text

Data Cleaning

&#x20;     ↓

HDFS

&#x20;     ↓

Hive

&#x20;     ↓

PySpark

&#x20;     ↓

6 Core Analyses

&#x20;     ↓

Visualizations

```



Core analyses:



1\. Team wins

2\. Top batsmen

3\. Top bowlers

4\. Toss analysis

5\. Venue analysis

6\. Season analysis



\---



\# 13. Full Version



Optional additions:



\* MapReduce

\* Sqoop

\* MongoDB

\* Powerplay analysis

\* Death-over analysis

\* Chasing vs defending

\* Team-vs-team analysis

\* Interactive dashboard



These should be implemented only after the MVP works correctly.




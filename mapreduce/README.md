# MapReduce Implementation & Viva Defense Guide

## Overview
This MapReduce job calculates the total number of match wins per team across all IPL seasons using Python Hadoop Streaming.

## Command Execution
```bash
mapred streaming \
  -files mapper.py,reducer.py \
  -mapper "python mapper.py" \
  -reducer "python reducer.py" \
  -input /ipl/clean/matches_clean.csv \
  -output /ipl/results/team_wins_mapreduce
```

## Viva Explanation Steps

1. **Map Phase (`mapper.py`)**:
   - Reads lines from `/ipl/clean/matches_clean.csv`.
   - Parses the CSV fields and extracts the `winner` column.
   - Emits key-value pair tuples: `(Team_Name \t 1)`.

2. **Shuffle and Sort Phase (Hadoop Framework)**:
   - Hadoop partitions the key-value pairs by key (`Team_Name`).
   - Sorts all keys alphabetically so all occurrences of a particular team (e.g., `Mumbai Indians`) are grouped together and sent to the same Reducer task instance.

3. **Reduce Phase (`reducer.py`)**:
   - Reads sorted stream from stdin.
   - Sums up the count `1` for each matching key.
   - Emits final aggregated total: `(Team_Name \t Total_Wins)`.

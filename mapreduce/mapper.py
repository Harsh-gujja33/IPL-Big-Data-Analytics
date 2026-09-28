#!/usr/bin/env python
"""
MapReduce Mapper for IPL Match Wins Aggregation
Input: CSV lines from ipl_matches_clean.csv
Output: Key-Value pairs -> (winner_team\t1)
"""

import sys
import csv

def main():
    reader = csv.reader(sys.stdin)
    header = None
    winner_idx = -1
    
    for row in reader:
        if not row:
            continue
        if header is None:
            header = [col.strip().lower() for col in row]
            if "winner" in header:
                winner_idx = header.index("winner")
            else:
                winner_idx = 9 # Fallback default
            continue
            
        if winner_idx < len(row):
            winner = row[winner_idx].strip()
            if winner and winner != "None" and winner != "" and winner.lower() != "no result":
                print(f"{winner}\t1")

if __name__ == "__main__":
    main()

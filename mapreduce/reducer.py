#!/usr/bin/env python
"""
MapReduce Reducer for IPL Match Wins Aggregation
Input: Sorted Key-Value pairs -> (winner_team\t1)
Output: Total wins per team -> (winner_team\tTotal_Wins)
"""

import sys

def main():
    current_team = None
    current_count = 0
    
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        
        try:
            team, count = line.split('\t', 1)
            count = int(count)
        except ValueError:
            continue
            
        if current_team == team:
            current_count += count
        else:
            if current_team is not None:
                print(f"{current_team}\t{current_count}")
            current_team = team
            current_count = count
            
    if current_team is not None:
        print(f"{current_team}\t{current_count}")

if __name__ == "__main__":
    main()

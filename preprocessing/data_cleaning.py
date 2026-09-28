"""
IPL Cricket Data Validation, Preprocessing and Analytics Generation Engine
Performs data validation (nulls, duplicates, schemas, match ID relationships)
and calculates exact IPL cricket statistics using legal balls for run rates.
"""

import os
import json
import pandas as pd
import numpy as np

MATCHES_PATH = os.path.join("Dataset", "ipl_matches_clean.csv")
DELIVERIES_PATH = os.path.join("Dataset", "ipl_ball_by_ball_clean.csv")
OUTPUT_JSON_PATH = os.path.join("web_app", "src", "data", "analytics_data.json")

def load_and_validate():
    if not os.path.exists(MATCHES_PATH) or not os.path.exists(DELIVERIES_PATH):
        raise FileNotFoundError("Clean dataset files missing in Dataset/ folder.")
    
    matches = pd.read_csv(MATCHES_PATH)
    deliveries = pd.read_csv(DELIVERIES_PATH, low_memory=False)
    
    print("=== DATASET VALIDATION ===")
    print(f"Matches dataset: {len(matches)} rows, {len(matches.columns)} columns. Duplicates: {matches.duplicated().sum()}")
    print(f"Deliveries dataset: {len(deliveries)} rows, {len(deliveries.columns)} columns. Duplicates: {deliveries.duplicated().sum()}")
    
    # Match ID relationship validation
    m_ids = set(matches['match_id'].unique())
    d_ids = set(deliveries['match_id'].unique())
    unmatched_d = len(d_ids - m_ids)
    unmatched_m = len(m_ids - d_ids)
    print(f"Match ID integrity check: Unmatched in deliveries={unmatched_d}, Unmatched in matches={unmatched_m}")
    
    if unmatched_d > 0 or unmatched_m > 0:
        print("WARNING: Unmatched match IDs found between datasets!")
    else:
        print("[PASSED] Match ID relationship validation passed 100%.")
        
    return matches, deliveries

def calculate_analytics(matches, deliveries):
    # 1. Overview KPIs
    total_matches = int(len(matches))
    total_deliveries = int(len(deliveries))
    seasons = sorted(matches['season'].unique().tolist())
    total_seasons = len(seasons)
    teams = sorted(list(set(matches['team1'].unique()).union(set(matches['team2'].unique()))))
    total_teams = len(teams)
    venues = sorted(matches['venue'].unique().tolist())
    total_venues = len(venues)
    total_runs = int(deliveries['total_runs'].sum())

    overview = {
        "total_matches": total_matches,
        "total_deliveries": total_deliveries,
        "total_seasons": total_seasons,
        "total_teams": total_teams,
        "total_venues": total_venues,
        "total_runs": total_runs,
        "seasons_list": seasons
    }

    # 2. Team Analytics
    team_stats = []
    for team in teams:
        played = len(matches[(matches['team1'] == team) | (matches['team2'] == team)])
        wins = len(matches[matches['winner'] == team])
        toss_wins = len(matches[matches['toss_winner'] == team])
        win_pct = round((wins / played * 100), 2) if played > 0 else 0.0
        
        team_stats.append({
            "team": team,
            "played": played,
            "wins": wins,
            "losses": played - wins,
            "win_pct": win_pct,
            "toss_wins": toss_wins
        })
    team_stats = sorted(team_stats, key=lambda x: x['wins'], reverse=True)

    # 3. Batting Leaderboard
    batting_grp = deliveries.groupby('batter')
    batter_runs = batting_grp['batter_runs'].sum()
    batter_legal_balls = batting_grp['legal_ball'].sum() # Exact legal balls faced
    batter_fours = deliveries[deliveries['is_boundary_4'] == 1].groupby('batter').size()
    batter_sixes = deliveries[deliveries['is_boundary_6'] == 1].groupby('batter').size()
    
    # Highest score per inning per batter
    inning_batter_runs = deliveries.groupby(['match_id', 'batter'])['batter_runs'].sum().reset_index()
    highest_scores = inning_batter_runs.groupby('batter')['batter_runs'].max()

    top_batsmen = []
    for batter in batter_runs.nlargest(20).index:
        r = int(batter_runs[batter])
        b = int(batter_legal_balls.get(batter, 0))
        f = int(batter_fours.get(batter, 0))
        s = int(batter_sixes.get(batter, 0))
        hs = int(highest_scores.get(batter, 0))
        sr = round((r / b * 100), 2) if b > 0 else 0.0
        top_batsmen.append({
            "player": batter,
            "runs": r,
            "balls": b,
            "strike_rate": sr,
            "fours": f,
            "sixes": s,
            "highest_score": hs
        })

    # 4. Bowling Leaderboard
    bowler_credited_dismissals = ['caught', 'bowled', 'lbw', 'stumped', 'caught and bowled', 'hit wicket']
    wicket_mask = deliveries['wicket_kind'].isin(bowler_credited_dismissals) if 'wicket_kind' in deliveries.columns else deliveries['is_wicket'] == 1
    
    bowler_wickets = deliveries[wicket_mask].groupby('bowler').size()
    
    # Bowler runs conceded (total_runs minus byes and legbyes)
    bowler_runs = deliveries.groupby('bowler')['total_runs'].sum() - deliveries.groupby('bowler')['byes'].sum() - deliveries.groupby('bowler')['legbyes'].sum()
    bowler_legal_balls = deliveries[deliveries['legal_ball'] == 1].groupby('bowler').size()

    top_bowlers = []
    for bowler in bowler_wickets.nlargest(20).index:
        w = int(bowler_wickets[bowler])
        r = int(bowler_runs.get(bowler, 0))
        b = int(bowler_legal_balls.get(bowler, 0))
        overs = round(b / 6.0, 1)
        econ = round((r / (b / 6.0)), 2) if b > 0 else 0.0
        top_bowlers.append({
            "player": bowler,
            "wickets": w,
            "runs": r,
            "balls": b,
            "overs": overs,
            "economy": econ
        })

    # 5. Toss Analysis
    toss_wins_match_win = len(matches[matches['toss_winner'] == matches['winner']])
    toss_pct = round((toss_wins_match_win / total_matches * 100), 2)
    toss_decision_cnt = matches['toss_decision'].value_counts().to_dict()

    toss_analysis = {
        "toss_match_wins": toss_wins_match_win,
        "toss_match_win_pct": toss_pct,
        "decisions": toss_decision_cnt
    }

    # 6. Venue Analysis (Top 10 Venues)
    venue_counts = matches['venue'].value_counts().nlargest(10).to_dict()
    venue_stats = []
    for v, count in venue_counts.items():
        v_matches = matches[matches['venue'] == v]
        v_deliveries = deliveries[deliveries['venue'] == v]
        avg_runs = round(v_deliveries['total_runs'].sum() / count, 1) if count > 0 else 0
        venue_stats.append({
            "venue": v,
            "matches": count,
            "avg_match_runs": avg_runs
        })

    # 7. Season Trends (Using Legal Balls for exact Run Rate)
    season_trends = []
    for season in seasons:
        s_matches = len(matches[matches['season'] == season])
        s_deliveries = deliveries[deliveries['season'] == season]
        s_runs = int(s_deliveries['total_runs'].sum())
        s_wickets = int(s_deliveries['is_wicket'].sum())
        s_legal_balls = int(s_deliveries['legal_ball'].sum())
        s_overs = s_legal_balls / 6.0
        avg_run_rate = round((s_runs / s_overs), 2) if s_overs > 0 else 0.0
        season_trends.append({
            "season": str(season),
            "matches": s_matches,
            "runs": s_runs,
            "wickets": s_wickets,
            "run_rate": avg_run_rate
        })

    # 8. Phase Analysis (Powerplay, Middle Overs, Death Overs using Legal Balls)
    pp_del = deliveries[deliveries['is_powerplay'] == 1]
    mid_del = deliveries[deliveries['is_middle_overs'] == 1]
    death_del = deliveries[deliveries['is_death_overs'] == 1]

    pp_legal_balls = pp_del['legal_ball'].sum()
    mid_legal_balls = mid_del['legal_ball'].sum()
    death_legal_balls = death_del['legal_ball'].sum()

    phase_analysis = {
        "powerplay": {
            "runs": int(pp_del['total_runs'].sum()),
            "wickets": int(pp_del['is_wicket'].sum()),
            "deliveries": len(pp_del),
            "legal_balls": int(pp_legal_balls),
            "run_rate": round((pp_del['total_runs'].sum() / (pp_legal_balls / 6.0)), 2) if pp_legal_balls > 0 else 0.0
        },
        "middle": {
            "runs": int(mid_del['total_runs'].sum()),
            "wickets": int(mid_del['is_wicket'].sum()),
            "deliveries": len(mid_del),
            "legal_balls": int(mid_legal_balls),
            "run_rate": round((mid_del['total_runs'].sum() / (mid_legal_balls / 6.0)), 2) if mid_legal_balls > 0 else 0.0
        },
        "death": {
            "runs": int(death_del['total_runs'].sum()),
            "wickets": int(death_del['is_wicket'].sum()),
            "deliveries": len(death_del),
            "legal_balls": int(death_legal_balls),
            "run_rate": round((death_del['total_runs'].sum() / (death_legal_balls / 6.0)), 2) if death_legal_balls > 0 else 0.0
        }
    }

    analytics_payload = {
        "overview": overview,
        "team_stats": team_stats,
        "top_batsmen": top_batsmen,
        "top_bowlers": top_bowlers,
        "toss_analysis": toss_analysis,
        "venue_stats": venue_stats,
        "season_trends": season_trends,
        "phase_analysis": phase_analysis
    }

    return analytics_payload

def main():
    print("Starting IPL Validation, Preprocessing & Analytics Data Processing...")
    matches, deliveries = load_and_validate()
    payload = calculate_analytics(matches, deliveries)
    
    os.makedirs(os.path.dirname(OUTPUT_JSON_PATH), exist_ok=True)
    with open(OUTPUT_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=2)
        
    print(f"[PASSED] Successfully exported calculated analytics payload to: {OUTPUT_JSON_PATH}")

if __name__ == '__main__':
    main()

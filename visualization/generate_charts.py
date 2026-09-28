"""
Matplotlib Standalone Visualization Generator
Generates high-resolution publication-quality PNG charts based on dynamic dataset analytics.
"""

import os
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib

# Set non-interactive backend for headless execution
matplotlib.use('Agg')

# Style parameters
plt.style.use('dark_background')
plt.rcParams['font.sans-serif'] = 'Segoe UI', 'DejaVu Sans', 'Arial'
plt.rcParams['axes.edgecolor'] = '#334155'
plt.rcParams['axes.linewidth'] = 1.2

MATCHES_PATH = os.path.join("Dataset", "ipl_matches_clean.csv")
DELIVERIES_PATH = os.path.join("Dataset", "ipl_ball_by_ball_clean.csv")
CHARTS_DIR = os.path.join("visualization", "charts")

def generate_charts():
    os.makedirs(CHARTS_DIR, exist_ok=True)
    matches = pd.read_csv(MATCHES_PATH)
    deliveries = pd.read_csv(DELIVERIES_PATH, low_memory=False)

    print("Generating Matplotlib Charts...")

    # Chart 1: Top Teams by Wins
    plt.figure(figsize=(10, 6))
    team_wins = matches[matches['winner'].notnull() & (matches['winner'] != '')]['winner'].value_counts()
    bars = plt.barh(team_wins.index[::-1], team_wins.values[::-1], color='#38bdf8')
    plt.title('IPL Top Teams by Total Wins', fontsize=14, fontweight='bold', pad=15, color='#f8fafc')
    plt.xlabel('Total Matches Won', fontsize=11, color='#cbd5e1')
    plt.tight_layout()
    plt.savefig(os.path.join(CHARTS_DIR, 'top_teams_wins.png'), dpi=300)
    plt.close()

    # Chart 2: Top 10 Batsmen by Runs
    plt.figure(figsize=(10, 6))
    top_batsmen = deliveries.groupby('batter')['batter_runs'].sum().nlargest(10)
    plt.barh(top_batsmen.index[::-1], top_batsmen.values[::-1], color='#f59e0b')
    plt.title('IPL Top 10 Highest Run Scorers', fontsize=14, fontweight='bold', pad=15, color='#f8fafc')
    plt.xlabel('Total Runs Scored', fontsize=11, color='#cbd5e1')
    plt.tight_layout()
    plt.savefig(os.path.join(CHARTS_DIR, 'top_batsmen_runs.png'), dpi=300)
    plt.close()

    # Chart 3: Top 10 Bowlers by Wickets
    plt.figure(figsize=(10, 6))
    credited_wickets = ['caught', 'bowled', 'lbw', 'stumped', 'caught and bowled', 'hit wicket']
    wicket_mask = deliveries['wicket_kind'].isin(credited_wickets) if 'wicket_kind' in deliveries.columns else deliveries['is_wicket'] == 1
    top_bowlers = deliveries[wicket_mask].groupby('bowler').size().nlargest(10)
    plt.bar(top_bowlers.index, top_bowlers.values, color='#10b981')
    plt.title('IPL Top 10 Wicket Takers', fontsize=14, fontweight='bold', pad=15, color='#f8fafc')
    plt.ylabel('Wickets Taken', fontsize=11, color='#cbd5e1')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(os.path.join(CHARTS_DIR, 'top_bowlers_wickets.png'), dpi=300)
    plt.close()

    # Chart 4: Toss Winner vs Match Winner
    plt.figure(figsize=(7, 7))
    toss_and_match = len(matches[matches['toss_winner'] == matches['winner']])
    toss_lost_match = len(matches) - toss_and_match
    plt.pie([toss_and_match, toss_lost_match], labels=['Toss Winner Won Match', 'Toss Winner Lost Match'],
            colors=['#06b6d4', '#f43f5e'], autopct='%1.1f%%', startangle=140, textprops={'color': '#f8fafc', 'fontsize': 12})
    plt.title('Toss Winner vs Match Winner Outcome', fontsize=14, fontweight='bold', pad=15, color='#f8fafc')
    plt.tight_layout()
    plt.savefig(os.path.join(CHARTS_DIR, 'toss_match_win_correlation.png'), dpi=300)
    plt.close()

    # Chart 5: Season-wise Runs Trend
    plt.figure(figsize=(11, 5))
    season_runs = deliveries.groupby('season')['total_runs'].sum()
    plt.plot(season_runs.index.astype(str), season_runs.values, marker='o', color='#a855f7', linewidth=2.5, markersize=7)
    plt.title('IPL Total Runs Scored Across Seasons', fontsize=14, fontweight='bold', pad=15, color='#f8fafc')
    plt.xlabel('Season', fontsize=11, color='#cbd5e1')
    plt.ylabel('Total Runs', fontsize=11, color='#cbd5e1')
    plt.xticks(rotation=45)
    plt.grid(True, linestyle='--', alpha=0.2)
    plt.tight_layout()
    plt.savefig(os.path.join(CHARTS_DIR, 'season_runs_trend.png'), dpi=300)
    plt.close()

    # Chart 6: Phase Run Rate Comparison
    plt.figure(figsize=(8, 5))
    pp_rr = deliveries[deliveries['is_powerplay'] == 1]['total_runs'].sum() / (len(deliveries[deliveries['is_powerplay'] == 1]) / 6.0)
    mid_rr = deliveries[deliveries['is_middle_overs'] == 1]['total_runs'].sum() / (len(deliveries[deliveries['is_middle_overs'] == 1]) / 6.0)
    death_rr = deliveries[deliveries['is_death_overs'] == 1]['total_runs'].sum() / (len(deliveries[deliveries['is_death_overs'] == 1]) / 6.0)
    
    phases = ['Powerplay (1-6)', 'Middle Overs (7-15)', 'Death Overs (16-20)']
    rrs = [pp_rr, mid_rr, death_rr]
    plt.bar(phases, rrs, color=['#3b82f6', '#8b5cf6', '#ec4899'])
    plt.title('Average Run Rate by Match Phase', fontsize=14, fontweight='bold', pad=15, color='#f8fafc')
    plt.ylabel('Run Rate (Runs per Over)', fontsize=11, color='#cbd5e1')
    plt.tight_layout()
    plt.savefig(os.path.join(CHARTS_DIR, 'powerplay_vs_death_scoring.png'), dpi=300)
    plt.close()

    print(f"All 6 charts successfully generated in: {CHARTS_DIR}")

if __name__ == '__main__':
    generate_charts()

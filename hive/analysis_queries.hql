-- Hive Analytical Queries for IPL Big Data Analysis

USE ipl_db;

-- 1. Total Matches & Seasons Count
SELECT 
    COUNT(DISTINCT match_id) AS total_matches,
    COUNT(DISTINCT season) AS total_seasons
FROM matches;

-- 2. Team Performance - Matches Won
SELECT 
    winner AS team,
    COUNT(*) AS total_wins
FROM matches
WHERE winner IS NOT NULL AND winner != 'None' AND winner != ''
GROUP BY winner
ORDER BY total_wins DESC;

-- 3. Top 10 Run Scorers (Batting Leaderboard)
SELECT 
    batter,
    SUM(batter_runs) AS total_runs,
    COUNT(CASE WHEN legal_ball = 1 THEN 1 END) AS balls_faced,
    ROUND((SUM(batter_runs) / COUNT(CASE WHEN legal_ball = 1 THEN 1 END)) * 100, 2) AS strike_rate,
    SUM(is_boundary_4) AS fours,
    SUM(is_boundary_6) AS sixes
FROM deliveries
GROUP BY batter
HAVING balls_faced > 0
ORDER BY total_runs DESC
LIMIT 10;

-- 4. Top 10 Wicket Takers (Bowling Leaderboard)
SELECT 
    bowler,
    COUNT(CASE WHEN is_wicket = 1 AND wicket_kind IN ('caught', 'bowled', 'lbw', 'stumped', 'caught and bowled', 'hit wicket') THEN 1 END) AS wickets,
    SUM(total_runs - byes - legbyes) AS runs_conceded,
    ROUND((SUM(total_runs - byes - legbyes) / (COUNT(CASE WHEN legal_ball = 1 THEN 1 END) / 6.0)), 2) AS economy
FROM deliveries
GROUP BY bowler
HAVING wickets > 0
ORDER BY wickets DESC
LIMIT 10;

-- 5. Descriptive Statistics on Total Match Runs (MIN, MAX, AVG, STDDEV)
SELECT 
    AVG(match_total_runs) AS avg_match_runs,
    MIN(match_total_runs) AS min_match_runs,
    MAX(match_total_runs) AS max_match_runs,
    STDDEV_SAMP(match_total_runs) AS stddev_match_runs
FROM (
    SELECT match_id, SUM(total_runs) AS match_total_runs
    FROM deliveries
    GROUP BY match_id
) sub;

-- 6. Toss Winner vs Match Winner Correlation
SELECT 
    COUNT(*) AS toss_and_match_wins,
    ROUND((COUNT(*) / (SELECT COUNT(*) FROM matches)) * 100, 2) AS percentage
FROM matches
WHERE toss_winner = winner;

-- 7. Phase Analysis: Powerplay vs Death Overs Run Rates
SELECT 
    phase,
    SUM(total_runs) AS total_runs,
    SUM(is_wicket) AS total_wickets,
    ROUND((SUM(total_runs) / (COUNT(CASE WHEN legal_ball = 1 THEN 1 END) / 6.0)), 2) AS run_rate
FROM deliveries
WHERE phase IN ('Powerplay', 'Death Overs', 'Middle Overs')
GROUP BY phase;

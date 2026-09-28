-- Hive External Tables Definition for Cleaned IPL Datasets

USE ipl_db;

-- 1. Matches Table
DROP TABLE IF EXISTS matches;

CREATE EXTERNAL TABLE IF NOT EXISTS matches (
    match_id INT,
    match_date STRING,
    season STRING,
    city STRING,
    venue STRING,
    team1 STRING,
    team2 STRING,
    toss_winner STRING,
    toss_decision STRING,
    winner STRING,
    player_of_match STRING,
    match_type STRING,
    overs INT,
    balls_per_over INT
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION '/ipl/clean/matches/'
TBLPROPERTIES ("skip.header.line.count"="1");

-- 2. Deliveries Table
DROP TABLE IF EXISTS deliveries;

CREATE EXTERNAL TABLE IF NOT EXISTS deliveries (
    match_id INT,
    match_date STRING,
    season STRING,
    city STRING,
    venue STRING,
    team1 STRING,
    team2 STRING,
    batting_team STRING,
    bowling_team STRING,
    innings INT,
    over INT,
    ball_in_over INT,
    legal_ball INT,
    legal_ball_number INT,
    over_ball_display DOUBLE,
    batter STRING,
    bowler STRING,
    non_striker STRING,
    batter_runs INT,
    extra_runs INT,
    total_runs INT,
    wides INT,
    noballs INT,
    byes INT,
    legbyes INT,
    penalty INT,
    is_boundary_4 INT,
    is_boundary_6 INT,
    is_dot_ball INT,
    is_wicket INT,
    wicket_count INT,
    wicket_player_out STRING,
    wicket_kind STRING,
    wicket_fielders STRING,
    innings_runs_so_far INT,
    innings_wickets_so_far INT,
    balls_remaining INT,
    current_run_rate DOUBLE,
    phase STRING,
    is_powerplay INT,
    is_middle_overs INT,
    is_death_overs INT,
    toss_winner STRING,
    toss_decision STRING,
    match_winner STRING,
    batting_team_won INT,
    target INT,
    runs_required INT,
    required_run_rate DOUBLE,
    is_chasing INT
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION '/ipl/clean/deliveries/'
TBLPROPERTIES ("skip.header.line.count"="1");

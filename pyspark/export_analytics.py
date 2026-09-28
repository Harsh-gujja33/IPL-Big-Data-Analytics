from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    sum, count, countDistinct, col, when,
    round, desc
)

OUTPUT = "/mnt/c/Users/gujja/Desktop/BDA Course Project/pyspark/outputs"

spark = SparkSession.builder \
    .master("local[*]") \
    .appName("IPL-BDA-Analytics-Export") \
    .config("spark.hadoop.fs.defaultFS", "hdfs://172.25.96.1:9000") \
    .config("spark.hadoop.dfs.client.use.datanode.hostname", "true") \
    .getOrCreate()

spark.sparkContext.setLogLevel("WARN")

# --------------------------------------------------
# LOAD DATA FROM HDFS
# --------------------------------------------------

df = spark.read \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .csv("hdfs://172.25.96.1:9000/ipl/dataset/ipl_ball_by_ball_clean.csv")

print("\nDataset loaded:", df.count(), "rows")

# --------------------------------------------------
# 1. TEAM BATTING
# --------------------------------------------------

team_stats = df.groupBy("batting_team").agg(
    sum("batter_runs").alias("total_batter_runs"),
    sum("total_runs").alias("total_runs"),
    sum("is_boundary_4").alias("fours"),
    sum("is_boundary_6").alias("sixes"),
    sum("legal_ball").alias("legal_balls")
)

team_stats = team_stats.withColumn(
    "strike_rate",
    round(
        col("total_batter_runs") / col("legal_balls") * 100,
        2
    )
)

team_stats.orderBy(desc("total_batter_runs")) \
    .coalesce(1) \
    .write.mode("overwrite").option("header", "true") \
    .csv(OUTPUT + "/team_stats")

# --------------------------------------------------
# 2. TOP BATSMEN
# --------------------------------------------------

batsman_stats = df.groupBy("batter").agg(
    sum("batter_runs").alias("runs"),
    sum("is_boundary_4").alias("fours"),
    sum("is_boundary_6").alias("sixes"),
    sum(
        when(col("legal_ball") == 1, 1).otherwise(0)
    ).alias("legal_balls")
)

batsman_stats = batsman_stats.withColumn(
    "strike_rate",
    round(
        col("runs") / col("legal_balls") * 100,
        2
    )
)

batsman_stats.orderBy(desc("runs")) \
    .limit(50) \
    .coalesce(1) \
    .write.mode("overwrite").option("header", "true") \
    .csv(OUTPUT + "/batsman_stats")

# --------------------------------------------------
# 3. TOP BOWLERS
# --------------------------------------------------

bowler_stats = df.groupBy("bowler").agg(
    sum("wicket_count").alias("wickets"),
    sum("total_runs").alias("runs_conceded"),
    sum("legal_ball").alias("legal_balls")
)

bowler_stats = bowler_stats.withColumn(
    "economy",
    round(
        col("runs_conceded") / col("legal_balls") * 6,
        2
    )
)

bowler_stats.orderBy(desc("wickets")) \
    .limit(50) \
    .coalesce(1) \
    .write.mode("overwrite").option("header", "true") \
    .csv(OUTPUT + "/bowler_stats")

# --------------------------------------------------
# 4. SEASON ANALYSIS
# --------------------------------------------------

season_stats = df.groupBy("season").agg(
    countDistinct("match_id").alias("matches"),
    sum("total_runs").alias("total_runs"),
    sum("wicket_count").alias("total_wickets")
)

season_stats = season_stats.withColumn(
    "avg_runs_per_match",
    round(
        col("total_runs") / col("matches"),
        2
    )
)

season_stats.orderBy("season") \
    .coalesce(1) \
    .write.mode("overwrite").option("header", "true") \
    .csv(OUTPUT + "/season_stats")

# --------------------------------------------------
# 5. PHASE ANALYSIS
# --------------------------------------------------

phase_stats = df.groupBy("phase").agg(
    sum("total_runs").alias("total_runs"),
    sum("wicket_count").alias("wickets"),
    sum("legal_ball").alias("legal_balls")
)

phase_stats = phase_stats.withColumn(
    "runs_per_over",
    round(
        col("total_runs") / col("legal_balls") * 6,
        2
    )
)

phase_stats.orderBy(desc("total_runs")) \
    .coalesce(1) \
    .write.mode("overwrite").option("header", "true") \
    .csv(OUTPUT + "/phase_stats")

# --------------------------------------------------
# 6. TOSS ANALYSIS
# --------------------------------------------------

matches = df.select(
    "match_id",
    "toss_winner",
    "toss_decision",
    "match_winner"
).dropDuplicates(["match_id"])

matches = matches.filter(
    col("toss_decision").isNotNull()
)

matches = matches.withColumn(
    "toss_and_match_win",
    when(col("toss_winner") == col("match_winner"), 1).otherwise(0)
)

toss_stats = matches.groupBy("toss_decision").agg(
    count("*").alias("matches"),
    sum("toss_and_match_win").alias("toss_and_match_wins")
)

toss_stats = toss_stats.withColumn(
    "win_percentage",
    round(
        col("toss_and_match_wins") / col("matches") * 100,
        2
    )
)

toss_stats.coalesce(1) \
    .write.mode("overwrite").option("header", "true") \
    .csv(OUTPUT + "/toss_stats")

# --------------------------------------------------
# 7. CHASING VS DEFENDING
# --------------------------------------------------

innings = df.select(
    "match_id",
    "innings",
    "is_chasing",
    "batting_team_won"
).dropDuplicates([
    "match_id",
    "innings"
])

innings = innings.filter(
    col("is_chasing").isNotNull()
)

innings = innings.withColumn(
    "match_type",
    when(col("is_chasing") == 1, "Chasing")
    .otherwise("Defending")
)

innings = innings.withColumn(
    "won",
    when(col("batting_team_won") == 1, 1).otherwise(0)
)

chasing_stats = innings.groupBy("match_type").agg(
    count("*").alias("innings"),
    sum("won").alias("wins")
)

chasing_stats = chasing_stats.withColumn(
    "win_percentage",
    round(
        col("wins") / col("innings") * 100,
        2
    )
)

chasing_stats.coalesce(1) \
    .write.mode("overwrite").option("header", "true") \
    .csv(OUTPUT + "/chasing_stats")

print("\n======================================")
print("ALL ANALYTICS EXPORTED SUCCESSFULLY")
print("Output folder:", OUTPUT)
print("======================================\n")

spark.stop()

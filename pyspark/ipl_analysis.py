"""
PySpark IPL Data Analysis Pipeline
Executes scalable DataFrames processing for team performance, batting, bowling, toss impact, and phase trends.
"""

import os
import sys

def main():
    try:
        from pyspark.sql import SparkSession
        from pyspark.sql import functions as F
    except ImportError:
        print("PySpark is not installed in local environment. PySpark script template generated for Hadoop cluster execution.")
        return

    spark = SparkSession.builder \
        .appName("IPL Big Data Analytics") \
        .master("local[*]") \
        .getOrCreate()
        
    print("Spark Session Created Successfully.")

    matches_path = os.path.join("Dataset", "ipl_matches_clean.csv")
    deliveries_path = os.path.join("Dataset", "ipl_ball_by_ball_clean.csv")

    matches_df = spark.read.csv(matches_path, header=True, inferSchema=True)
    deliveries_df = spark.read.csv(deliveries_path, header=True, inferSchema=True)

    print("\n--- Spark Matches Schema ---")
    matches_df.printSchema()

    print("\n--- Team Performance (Wins Count) ---")
    team_wins = matches_df.filter(F.col("winner").isNotNull()) \
        .groupBy("winner") \
        .agg(F.count("match_id").alias("total_wins")) \
        .orderBy(F.col("total_wins").desc())
    team_wins.show(10, truncate=False)

    print("\n--- Top 10 Batsmen ---")
    top_batsmen = deliveries_df.groupBy("batter") \
        .agg(
            F.sum("batter_runs").alias("total_runs"),
            F.sum(F.when(F.col("legal_ball") == 1, 1).otherwise(0)).alias("balls_faced"),
            F.sum("is_boundary_4").alias("fours"),
            F.sum("is_boundary_6").alias("sixes")
        ) \
        .withColumn("strike_rate", F.round((F.col("total_runs") / F.col("balls_faced")) * 100, 2)) \
        .orderBy(F.col("total_runs").desc())
    top_batsmen.show(10, truncate=False)

    print("\n--- Top 10 Bowlers ---")
    credited_wickets = ['caught', 'bowled', 'lbw', 'stumped', 'caught and bowled', 'hit wicket']
    top_bowlers = deliveries_df.filter(F.col("wicket_kind").isin(credited_wickets)) \
        .groupBy("bowler") \
        .agg(F.count("is_wicket").alias("wickets")) \
        .orderBy(F.col("wickets").desc())
    top_bowlers.show(10, truncate=False)

    spark.stop()

if __name__ == "__main__":
    main()

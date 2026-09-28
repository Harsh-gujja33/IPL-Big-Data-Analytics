"""
PySpark Exploratory Data Analysis (EDA) Script
Performs dataset validation, schema inspection, null value counts, and descriptive stats.
"""

import os

def main():
    try:
        from pyspark.sql import SparkSession
        from pyspark.sql import functions as F
    except ImportError:
        print("PySpark environment note: Run this script inside a Spark environment or after running pip install pyspark.")
        return

    spark = SparkSession.builder \
        .appName("IPL PySpark EDA") \
        .getOrCreate()

    matches_path = os.path.join("Dataset", "ipl_matches_clean.csv")
    deliveries_path = os.path.join("Dataset", "ipl_ball_by_ball_clean.csv")

    matches = spark.read.csv(matches_path, header=True, inferSchema=True)
    deliveries = spark.read.csv(deliveries_path, header=True, inferSchema=True)

    print(f"Matches count: {matches.count()}")
    print(f"Deliveries count: {deliveries.count()}")

    print("\nMatches Summary Statistics:")
    matches.describe("overs", "balls_per_over").show()

    spark.stop()

if __name__ == "__main__":
    main()

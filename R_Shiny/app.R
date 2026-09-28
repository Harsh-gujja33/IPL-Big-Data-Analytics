# ============================================================
# IPL CRICKET DATA ANALYTICS
# PREMIUM 3D R SHINY DASHBOARD
#
# Big Data Analytics Project
#
# Technologies:
# Hadoop / HDFS
# MapReduce
# Hive
# PySpark
# R Shiny
# ============================================================


# ============================================================
# 1. LIBRARIES
# ============================================================

library(shiny)
library(ggplot2)
library(dplyr)
library(DT)
library(tidyr)
library(scales)


# ============================================================
# 2. DATA PATHS
# ============================================================

MATCH_FILE <- "../Dataset/clean/ipl_matches_clean.csv"
BALL_FILE  <- "../Dataset/clean/ipl_ball_by_ball_clean.csv"


# ============================================================
# 3. CHECK FILES
# ============================================================

if (!file.exists(MATCH_FILE)) {
  stop(
    paste(
      "Match dataset not found:",
      normalizePath(MATCH_FILE, mustWork = FALSE)
    )
  )
}

if (!file.exists(BALL_FILE)) {
  stop(
    paste(
      "Ball-by-ball dataset not found:",
      normalizePath(BALL_FILE, mustWork = FALSE)
    )
  )
}


# ============================================================
# 4. LOAD MATCH DATA
# ============================================================

cat("Loading match dataset...\n")

matches <- read.csv(
  MATCH_FILE,
  stringsAsFactors = FALSE,
  check.names = FALSE
)

cat(
  "Match records:",
  nrow(matches),
  "\n"
)


# ============================================================
# 5. LOAD BALL-BY-BALL DATA
# ============================================================

cat("Loading ball-by-ball dataset...\n")

balls <- read.csv(
  BALL_FILE,
  stringsAsFactors = FALSE,
  check.names = FALSE
)

cat(
  "Ball-by-ball records:",
  format(nrow(balls), big.mark = ","),
  "\n"
)


# ============================================================
# 6. DATA TYPE CONVERSION
# ============================================================

matches$season <- as.character(matches$season)
balls$season <- as.character(balls$season)

balls$batter_runs <- as.numeric(balls$batter_runs)
balls$extra_runs <- as.numeric(balls$extra_runs)
balls$total_runs <- as.numeric(balls$total_runs)

balls$is_boundary_4 <- as.numeric(balls$is_boundary_4)
balls$is_boundary_6 <- as.numeric(balls$is_boundary_6)
balls$is_dot_ball <- as.numeric(balls$is_dot_ball)
balls$is_wicket <- as.numeric(balls$is_wicket)

balls$wicket_count <- as.numeric(balls$wicket_count)
balls$legal_ball <- as.numeric(balls$legal_ball)


# ============================================================
# 7. COMMON DATA
# ============================================================

teams <- sort(
  unique(
    c(
      matches$team1,
      matches$team2
    )
  )
)

teams <- teams[
  !is.na(teams) &
    teams != ""
]

seasons <- sort(
  unique(matches$season)
)


# ============================================================
# 8. PREMIUM PLOT THEME
# ============================================================

premium_theme <- function(base_size = 13) {

  theme_minimal(
    base_size = base_size
  ) +

    theme(

      plot.background =
        element_rect(
          fill = "#ffffff",
          color = NA
        ),

      panel.background =
        element_rect(
          fill = "#ffffff",
          color = NA
        ),

      panel.grid.major =
        element_line(
          color = "#e8edf5",
          linewidth = 0.45
        ),

      panel.grid.minor =
        element_blank(),

      axis.title =
        element_text(
          color = "#52627a",
          face = "bold",
          size = 11
        ),

      axis.text =
        element_text(
          color = "#64748b",
          size = 10
        ),

      plot.title =
        element_text(
          color = "#0f172a",
          face = "bold",
          size = 16
        ),

      plot.subtitle =
        element_text(
          color = "#64748b",
          size = 11
        ),

      plot.margin =
        margin(
          12,
          15,
          12,
          15
        )
    )
}


# ============================================================
# 9. UI
# ============================================================

ui <- fluidPage(

  # ==========================================================
  # PREMIUM CSS
  # ==========================================================

  tags$head(

    tags$style(
      HTML(
"
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Orbitron:wght@500;600;700&display=swap');


/* =========================================================
   GLOBAL
   ========================================================= */

html,
body {
    margin: 0;
    padding: 0;
    background:
        radial-gradient(
            circle at 10% 10%,
            rgba(37,99,235,0.08),
            transparent 30%
        ),
        radial-gradient(
            circle at 90% 20%,
            rgba(99,102,241,0.07),
            transparent 30%
        ),
        #f4f7fb;

    font-family:
        'Inter',
        Arial,
        sans-serif;

    color: #0f172a;
}


/* =========================================================
   NAVIGATION
   ========================================================= */

.navbar {
    min-height: 72px !important;

    background:
        linear-gradient(
            135deg,
            #07111f 0%,
            #0b1730 45%,
            #111c38 100%
        ) !important;

    border: none !important;

    box-shadow:
        0 10px 35px rgba(2,8,23,0.28);

    margin-bottom: 0 !important;

    border-radius: 0 !important;

    position: sticky;
    top: 0;
    z-index: 9999;
}


.navbar-header {
    min-height: 72px;
}


.navbar-brand {
    height: 72px !important;
    line-height: 72px !important;

    color: #ffffff !important;

    font-size: 21px !important;

    font-weight: 800 !important;

    letter-spacing: -0.4px;

    padding-left: 24px !important;
    padding-right: 18px !important;
}


.navbar-brand:hover {
    color: #ffffff !important;
    background: transparent !important;
}


.brand-icon {
    font-size: 23px;
    margin-right: 7px;
}


.brand-main {
    color: #ffffff;
}


.brand-highlight {
    color: #60a5fa;
}


.navbar-nav > li > a {
    height: 72px !important;

    line-height: 72px !important;

    padding:
        0 14px !important;

    color: #b8c5d8 !important;

    font-size: 12.5px !important;

    font-weight: 600 !important;

    transition:
        all 0.25s ease;
}


.navbar-nav > li > a:hover {
    color: #ffffff !important;

    background:
        rgba(255,255,255,0.07) !important;
}


.navbar-nav > .active > a,
.navbar-nav > .active > a:hover {
    color: #ffffff !important;

    background:
        linear-gradient(
            135deg,
            #2563eb,
            #4f46e5
        ) !important;

    box-shadow:
        inset 0 -3px 0 rgba(255,255,255,0.45);
}


/* =========================================================
   MAIN PAGE
   ========================================================= */

.container-fluid {
    padding-left: 30px !important;
    padding-right: 30px !important;
}


.tab-content {
    padding-top: 0 !important;
}


/* =========================================================
   HERO SECTION
   ========================================================= */

.hero {
    position: relative;

    overflow: hidden;

    margin:
        28px 0 25px 0;

    padding:
        34px 38px;

    border-radius: 24px;

    background:
        linear-gradient(
            135deg,
            #0b1730 0%,
            #10295a 48%,
            #1d4ed8 100%
        );

    box-shadow:
        0 20px 45px rgba(15,23,42,0.22),

        inset 0 1px 0
        rgba(255,255,255,0.14);

    color: white;
}


.hero:before {
    content: '';

    position: absolute;

    width: 350px;
    height: 350px;

    right: -120px;
    top: -170px;

    border-radius: 50%;

    background:
        rgba(96,165,250,0.20);

    filter: blur(5px);
}


.hero:after {
    content: '';

    position: absolute;

    width: 220px;
    height: 220px;

    right: 170px;
    bottom: -160px;

    border-radius: 50%;

    background:
        rgba(129,140,248,0.18);

    filter: blur(3px);
}


.hero-content {
    position: relative;
    z-index: 2;
}


.hero-kicker {
    font-size: 11px;

    font-weight: 800;

    letter-spacing: 2px;

    text-transform: uppercase;

    color: #93c5fd;

    margin-bottom: 8px;
}


.hero-title {
    font-size: 34px;

    font-weight: 800;

    letter-spacing: -1.2px;

    margin: 0 0 9px 0;

    color: #ffffff;
}


.hero-subtitle {
    font-size: 14px;

    color: #dbeafe;

    margin: 0;

    max-width: 700px;

    line-height: 1.7;
}


.hero-badge {
    display: inline-block;

    margin-top: 20px;

    padding:
        8px 14px;

    border-radius: 50px;

    background:
        rgba(255,255,255,0.10);

    border:
        1px solid rgba(255,255,255,0.20);

    color: #e0f2fe;

    font-size: 11px;

    font-weight: 700;

    backdrop-filter: blur(10px);
}


/* =========================================================
   SECTION HEADINGS
   ========================================================= */

.section-header {
    margin:
        25px 0 15px 0;

    display: flex;

    align-items: center;

    gap: 10px;
}


.section-dot {
    width: 8px;
    height: 28px;

    border-radius: 20px;

    background:
        linear-gradient(
            180deg,
            #60a5fa,
            #2563eb
        );

    box-shadow:
        0 5px 14px
        rgba(37,99,235,0.35);
}


.section-title {
    font-size: 18px;

    font-weight: 800;

    color: #0f172a;

    margin: 0;
}


.section-subtitle {
    color: #64748b;

    font-size: 12px;

    margin-top: 3px;
}


/* =========================================================
   KPI CARDS
   ========================================================= */

.kpi-card {
    position: relative;

    overflow: hidden;

    min-height: 145px;

    padding: 23px;

    margin-bottom: 22px;

    border-radius: 20px;

    background:
        linear-gradient(
            145deg,
            rgba(255,255,255,0.98),
            rgba(247,250,255,0.96)
        );

    border:
        1px solid rgba(148,163,184,0.18);

    box-shadow:
        0 12px 30px rgba(15,23,42,0.08),

        0 3px 7px rgba(15,23,42,0.04),

        inset 0 1px 0 #ffffff;

    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease;
}


.kpi-card:hover {
    transform:
        translateY(-7px)
        rotateX(1deg);

    box-shadow:
        0 22px 42px rgba(15,23,42,0.14),

        0 5px 10px rgba(37,99,235,0.07);
}


.kpi-card:before {
    content: '';

    position: absolute;

    width: 115px;
    height: 115px;

    right: -35px;
    top: -40px;

    border-radius: 50%;

    background:
        rgba(37,99,235,0.08);
}


.kpi-top {
    display: flex;

    justify-content: space-between;

    align-items: center;

    position: relative;
}


.kpi-icon {
    width: 43px;
    height: 43px;

    border-radius: 13px;

    display: flex;

    align-items: center;
    justify-content: center;

    font-size: 20px;

    background:
        linear-gradient(
            135deg,
            #dbeafe,
            #eff6ff
        );

    box-shadow:
        inset 0 1px 0 white,
        0 6px 14px
        rgba(37,99,235,0.10);
}


.kpi-status {
    font-size: 9px;

    font-weight: 800;

    text-transform: uppercase;

    letter-spacing: 1px;

    color: #16a34a;
}


.metric-number {
    position: relative;

    margin-top: 15px;

    font-size: 30px;

    font-weight: 800;

    letter-spacing: -1px;

    color: #0f172a;
}


.metric-label {
    position: relative;

    margin-top: 4px;

    color: #64748b;

    font-size: 11px;

    font-weight: 600;

    text-transform: uppercase;

    letter-spacing: 0.8px;
}


/* =========================================================
   CHART CARDS
   ========================================================= */

.chart-card {
    background:
        rgba(255,255,255,0.96);

    border:
        1px solid rgba(148,163,184,0.18);

    border-radius: 20px;

    padding:
        17px 18px 12px 18px;

    margin-bottom: 23px;

    box-shadow:
        0 10px 28px rgba(15,23,42,0.07),

        inset 0 1px 0 #ffffff;

    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease;
}


.chart-card:hover {
    transform: translateY(-3px);

    box-shadow:
        0 17px 35px rgba(15,23,42,0.11);
}


.chart-heading {
    display: flex;

    align-items: center;

    gap: 9px;

    margin-bottom: 8px;

    font-size: 14px;

    font-weight: 800;

    color: #0f172a;
}


.chart-heading:before {
    content: '';

    width: 5px;
    height: 19px;

    border-radius: 10px;

    background:
        linear-gradient(
            180deg,
            #60a5fa,
            #2563eb
        );
}


/* =========================================================
   INFORMATION CARDS
   ========================================================= */

.info-box {
    position: relative;

    background:
        linear-gradient(
            145deg,
            #ffffff,
            #f8fbff
        );

    border:
        1px solid rgba(148,163,184,0.18);

    border-radius: 20px;

    padding: 26px;

    margin-bottom: 25px;

    box-shadow:
        0 12px 30px rgba(15,23,42,0.07);

    line-height: 1.7;
}


.info-box h2 {
    color: #0f172a;

    font-weight: 800;

    margin-top: 0;
}


.info-box h3 {
    color: #1d4ed8;

    font-weight: 800;

    margin-top: 25px;
}


.info-box p {
    color: #64748b;

    font-size: 13px;
}


.info-box li {
    color: #475569;

    margin-bottom: 10px;

    font-size: 13px;
}


/* =========================================================
   FILTER PANEL
   ========================================================= */

.filter-card {
    background:
        linear-gradient(
            145deg,
            #ffffff,
            #f8fbff
        );

    border-radius: 20px;

    padding:
        20px 22px 10px 22px;

    margin:
        25px 0 22px 0;

    border:
        1px solid rgba(148,163,184,0.18);

    box-shadow:
        0 10px 28px rgba(15,23,42,0.06);
}


.control-label {
    color: #334155 !important;

    font-size: 11px !important;

    font-weight: 800 !important;

    text-transform: uppercase;

    letter-spacing: 0.6px;
}


.form-control {
    border:
        1px solid #dbe3ef !important;

    border-radius: 11px !important;

    min-height: 40px;

    box-shadow:
        inset 0 1px 3px
        rgba(15,23,42,0.03) !important;

    color: #334155 !important;

    font-size: 12px !important;
}


.form-control:focus {
    border-color:
        #60a5fa !important;

    box-shadow:
        0 0 0 3px
        rgba(37,99,235,0.10) !important;
}


/* =========================================================
   DATA TABLES
   ========================================================= */

.dataTables_wrapper {
    background: #ffffff;

    border-radius: 18px;

    padding: 16px;

    box-shadow:
        0 10px 28px rgba(15,23,42,0.06);

    border:
        1px solid rgba(148,163,184,0.16);

    margin-bottom: 25px;
}


table.dataTable {
    border-collapse: separate !important;

    border-spacing: 0;
}


table.dataTable thead th {
    background:
        #0f1b31 !important;

    color: #ffffff !important;

    border: none !important;

    font-size: 11px;

    text-transform: uppercase;

    letter-spacing: 0.5px;
}


table.dataTable tbody td {
    color: #475569 !important;

    font-size: 12px;

    border-bottom:
        1px solid #edf1f7 !important;
}


table.dataTable tbody tr:hover {
    background:
        #f1f6ff !important;
}


/* =========================================================
   ABOUT TECHNOLOGY CARDS
   ========================================================= */

.tech-grid {
    display: flex;

    flex-wrap: wrap;

    gap: 15px;

    margin-top: 20px;
}


.tech-card {
    flex: 1 1 180px;

    padding: 18px;

    min-height: 115px;

    border-radius: 17px;

    background:
        linear-gradient(
            145deg,
            #ffffff,
            #f6f9ff
        );

    border:
        1px solid #e5ebf5;

    box-shadow:
        0 8px 20px rgba(15,23,42,0.06);

    transition:
        all 0.25s ease;
}


.tech-card:hover {
    transform:
        translateY(-5px);

    box-shadow:
        0 15px 28px rgba(15,23,42,0.11);
}


.tech-icon {
    font-size: 25px;

    margin-bottom: 9px;
}


.tech-name {
    color: #0f172a;

    font-size: 13px;

    font-weight: 800;
}


.tech-desc {
    color: #64748b;

    font-size: 11px;

    margin-top: 5px;

    line-height: 1.5;
}


/* =========================================================
   FOOTER
   ========================================================= */

.footer {
    margin-top: 30px;

    padding:
        24px;

    text-align: center;

    color: #94a3b8;

    font-size: 11px;
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 900px) {

    .container-fluid {
        padding-left: 15px !important;
        padding-right: 15px !important;
    }

    .hero {
        padding: 27px 24px;
    }

    .hero-title {
        font-size: 27px;
    }

    .navbar-nav > li > a {
        height: auto !important;
        line-height: 42px !important;
    }

}


@media (max-width: 600px) {

    .hero-title {
        font-size: 23px;
    }

    .metric-number {
        font-size: 25px;
    }

}


/* =========================================================
   SHINY NOTIFICATION
   ========================================================= */

.shiny-notification {
    border-radius: 12px !important;

    box-shadow:
        0 15px 35px
        rgba(15,23,42,0.20) !important;
}
"
      )
    )
  ),


  # ==========================================================
  # NAVBAR
  # ==========================================================

  navbarPage(

    title =
      tagList(
        span(
          class = "brand-icon",
          "🏏"
        ),
        span(
          class = "brand-main",
          "IPL BDA "
        ),
        span(
          class = "brand-highlight",
          "ANALYTICS"
        )
      ),

    id = "main_nav",


    # ========================================================
    # DASHBOARD
    # ========================================================

    tabPanel(

      "Dashboard",

      # ------------------------------------------------------
      # HERO
      # ------------------------------------------------------

      div(
        class = "hero",

        div(
          class = "hero-content",

          div(
            class = "hero-kicker",
            "BIG DATA ANALYTICS • IPL CRICKET"
          ),

          div(
            class = "hero-title",
            "IPL Cricket Data Analytics"
          ),

          div(
            class = "hero-subtitle",
            "Explore IPL match, player, batting, bowling, venue and phase-level insights through a premium interactive analytics dashboard."
          ),

          div(
            class = "hero-badge",
            "HADOOP  •  HDFS  •  MAPREDUCE  •  HIVE  •  PYSPARK  •  R SHINY"
          )
        )
      ),


      # ------------------------------------------------------
      # KPI SECTION
      # ------------------------------------------------------

      div(
        class = "section-header",

        div(class = "section-dot"),

        div(
          div(
            class = "section-title",
            "IPL Overview"
          ),

          div(
            class = "section-subtitle",
            "Key statistics generated from the cleaned IPL datasets"
          )
        )
      ),


      fluidRow(

        column(
          3,

          div(
            class = "kpi-card",

            div(
              class = "kpi-top",

              div(
                class = "kpi-icon",
                "🏏"
              ),

              div(
                class = "kpi-status",
                "LIVE DATA"
              )
            ),

            div(
              class = "metric-number",
              textOutput("kpi_matches")
            ),

            div(
              class = "metric-label",
              "Total Matches"
            )
          )
        ),


        column(
          3,

          div(
            class = "kpi-card",

            div(
              class = "kpi-top",

              div(
                class = "kpi-icon",
                "📅"
              ),

              div(
                class = "kpi-status",
                "SEASONS"
              )
            ),

            div(
              class = "metric-number",
              textOutput("kpi_seasons")
            ),

            div(
              class = "metric-label",
              "IPL Seasons"
            )
          )
        ),


        column(
          3,

          div(
            class = "kpi-card",

            div(
              class = "kpi-top",

              div(
                class = "kpi-icon",
                "⚡"
              ),

              div(
                class = "kpi-status",
                "BALL DATA"
              )
            ),

            div(
              class = "metric-number",
              textOutput("kpi_deliveries")
            ),

            div(
              class = "metric-label",
              "Deliveries"
            )
          )
        ),


        column(
          3,

          div(
            class = "kpi-card",

            div(
              class = "kpi-top",

              div(
                class = "kpi-icon",
                "🔥"
              ),

              div(
                class = "kpi-status",
                "RUNS"
              )
            ),

            div(
              class = "metric-number",
              textOutput("kpi_runs")
            ),

            div(
              class = "metric-label",
              "Total Runs"
            )
          )
        )

      ),


      # ------------------------------------------------------
      # CHARTS
      # ------------------------------------------------------

      div(
        class = "section-header",

        div(class = "section-dot"),

        div(
          div(
            class = "section-title",
            "Performance Overview"
          ),

          div(
            class = "section-subtitle",
            "Season progression and winning-team distribution"
          )
        )
      ),


      fluidRow(

        column(
          6,

          div(
            class = "chart-card",

            div(
              class = "chart-heading",
              "Matches Played by Season"
            ),

            plotOutput(
              "season_matches_plot",
              height = "360px"
            )
          )
        ),


        column(
          6,

          div(
            class = "chart-card",

            div(
              class = "chart-heading",
              "Top Winning Teams"
            ),

            plotOutput(
              "top_winners_plot",
              height = "360px"
            )
          )
        )

      ),


      # ------------------------------------------------------
      # PROJECT OVERVIEW
      # ------------------------------------------------------

      div(
        class = "info-box",

        h3(
          "📊 About This Dashboard"
        ),

        p(
          "This dashboard presents interactive analytics from IPL match-level and ball-by-ball cricket data."
        ),

        p(
          "The project combines distributed storage, Big Data processing, SQL-based analytics and interactive R visualization."
        )
      ),


      div(
        class = "footer",
        "IPL BDA Analytics • Big Data Analytics Academic Project • R Shiny"
      )

    ),


    # ========================================================
    # TEAM ANALYSIS
    # ========================================================

    tabPanel(

      "Team Analysis",

      div(
        class = "section-header",

        div(class = "section-dot"),

        div(
          div(
            class = "section-title",
            "Team Analytics"
          ),

          div(
            class = "section-subtitle",
            "Explore team wins and match participation"
          )
        )
      ),


      div(
        class = "filter-card",

        fluidRow(

          column(
            4,

            selectInput(
              "team_filter",
              "Select Team:",
              choices = c(
                "All Teams",
                teams
              )
            )
          ),

          column(
            4,

            selectInput(
              "season_filter",
              "Select Season:",
              choices = c(
                "All Seasons",
                seasons
              )
            )
          )

        )
      ),


      fluidRow(

        column(
          6,

          div(
            class = "chart-card",

            div(
              class = "chart-heading",
              "Team Wins"
            ),

            plotOutput(
              "team_wins_plot",
              height = "400px"
            )
          )
        ),


        column(
          6,

          div(
            class = "chart-card",

            div(
              class = "chart-heading",
              "Team Match Participation"
            ),

            plotOutput(
              "team_matches_plot",
              height = "400px"
            )
          )
        )

      ),


      div(
        class = "section-header",

        div(class = "section-dot"),

        div(
          class = "section-title",
          "Team Performance Table"
        )
      ),

      DTOutput(
        "team_table"
      )

    ),


    # ========================================================
    # PLAYER ANALYSIS
    # ========================================================

    tabPanel(

      "Player Analysis",

      div(
        class = "section-header",

        div(class = "section-dot"),

        div(
          div(
            class = "section-title",
            "Player Analytics"
          ),

          div(
            class = "section-subtitle",
            "Batting output and bowling activity across IPL seasons"
          )
        )
      ),


      fluidRow(

        column(
          6,

          div(
            class = "chart-card",

            div(
              class = "chart-heading",
              "Top 10 Run Scorers"
            ),

            plotOutput(
              "top_batters_plot",
              height = "430px"
            )
          )
        ),


        column(
          6,

          div(
            class = "chart-card",

            div(
              class = "chart-heading",
              "Top 10 Bowlers by Deliveries"
            ),

            plotOutput(
              "top_bowlers_plot",
              height = "430px"
            )
          )
        )

      ),


      div(
        class = "section-header",

        div(class = "section-dot"),

        div(
          class = "section-title",
          "Player Statistics"
        )
      ),

      DTOutput(
        "player_table"
      )

    ),


    # ========================================================
    # BATTING ANALYSIS
    # ========================================================

    tabPanel(

      "Batting Analysis",

      div(
        class = "section-header",

        div(class = "section-dot"),

        div(
          div(
            class = "section-title",
            "Batting Analytics"
          ),

          div(
            class = "section-subtitle",
            "Runs, boundaries and scoring patterns"
          )
        )
      ),


      fluidRow(

        column(
          6,

          div(
            class = "chart-card",

            div(
              class = "chart-heading",
              "Runs by Batter"
            ),

            plotOutput(
              "batter_runs_plot",
              height = "430px"
            )
          )
        ),


        column(
          6,

          div(
            class = "chart-card",

            div(
              class = "chart-heading",
              "Boundary Analysis"
            ),

            plotOutput(
              "boundary_plot",
              height = "430px"
            )
          )
        )

      ),


      div(
        class = "chart-card",

        div(
          class = "chart-heading",
          "Run Type Distribution"
        ),

        plotOutput(
          "run_type_plot",
          height = "390px"
        )
      )

    ),


    # ========================================================
    # BOWLING ANALYSIS
    # ========================================================

    tabPanel(

      "Bowling Analysis",

      div(
        class = "section-header",

        div(class = "section-dot"),

        div(
          div(
            class = "section-title",
            "Bowling Analytics"
          ),

          div(
            class = "section-subtitle",
            "Wickets, dot balls and boundary statistics"
          )
        )
      ),


      fluidRow(

        column(
          4,

          div(
            class = "kpi-card",

            div(
              class = "kpi-top",

              div(
                class = "kpi-icon",
                "🎯"
              ),

              div(
                class = "kpi-status",
                "WICKETS"
              )
            ),

            div(
              class = "metric-number",
              textOutput("kpi_wickets")
            ),

            div(
              class = "metric-label",
              "Total Wickets"
            )
          )
        ),


        column(
          4,

          div(
            class = "kpi-card",

            div(
              class = "kpi-top",

              div(
                class = "kpi-icon",
                "🟢"
              ),

              div(
                class = "kpi-status",
                "DEFENCE"
              )
            ),

            div(
              class = "metric-number",
              textOutput("kpi_dots")
            ),

            div(
              class = "metric-label",
              "Dot Balls"
            )
          )
        ),


        column(
          4,

          div(
            class = "kpi-card",

            div(
              class = "kpi-top",

              div(
                class = "kpi-icon",
                "💥"
              ),

              div(
                class = "kpi-status",
                "ATTACK"
              )
            ),

            div(
              class = "metric-number",
              textOutput("kpi_boundaries")
            ),

            div(
              class = "metric-label",
              "Boundaries"
            )
          )
        )

      ),


      fluidRow(

        column(
          6,

          div(
            class = "chart-card",

            div(
              class = "chart-heading",
              "Top Bowlers by Wickets"
            ),

            plotOutput(
              "wicket_bowlers_plot",
              height = "430px"
            )
          )
        ),


        column(
          6,

          div(
            class = "chart-card",

            div(
              class = "chart-heading",
              "Wickets by Match Phase"
            ),

            plotOutput(
              "phase_wickets_plot",
              height = "430px"
            )
          )
        )

      )

    ),


    # ========================================================
    # VENUE ANALYSIS
    # ========================================================

    tabPanel(

      "Venue Analysis",

      div(
        class = "section-header",

        div(class = "section-dot"),

        div(
          div(
            class = "section-title",
            "Venue Analytics"
          ),

          div(
            class = "section-subtitle",
            "Discover the most frequently used IPL venues"
          )
        )
      ),


      div(
        class = "chart-card",

        div(
          class = "chart-heading",
          "Matches by Venue"
        ),

        plotOutput(
          "venue_plot",
          height = "570px"
        )
      ),


      div(
        class = "section-header",

        div(class = "section-dot"),

        div(
          class = "section-title",
          "Venue Statistics"
        )
      ),

      DTOutput(
        "venue_table"
      )

    ),


    # ========================================================
    # PHASE ANALYSIS
    # ========================================================

    tabPanel(

      "Phase Analysis",

      div(
        class = "section-header",

        div(class = "section-dot"),

        div(
          div(
            class = "section-title",
            "Match Phase Analytics"
          ),

          div(
            class = "section-subtitle",
            "Compare scoring and wicket patterns across match phases"
          )
        )
      ),


      fluidRow(

        column(
          6,

          div(
            class = "chart-card",

            div(
              class = "chart-heading",
              "Runs by Match Phase"
            ),

            plotOutput(
              "phase_runs_plot",
              height = "410px"
            )
          )
        ),


        column(
          6,

          div(
            class = "chart-card",

            div(
              class = "chart-heading",
              "Wickets by Match Phase"
            ),

            plotOutput(
              "phase_wickets_chart",
              height = "410px"
            )
          )
        )

      )

    ),


    # ========================================================
    # DATA EXPLORER
    # ========================================================

    tabPanel(

      "Data Explorer",

      div(
        class = "section-header",

        div(class = "section-dot"),

        div(
          div(
            class = "section-title",
            "Data Explorer"
          ),

          div(
            class = "section-subtitle",
            "Explore the cleaned IPL datasets used by the dashboard"
          )
        )
      ),


      div(
        class = "chart-card",

        div(
          class = "chart-heading",
          "Match Dataset"
        ),

        DTOutput(
          "match_data"
        )
      ),


      div(
        class = "chart-card",

        div(
          class = "chart-heading",
          "Ball-by-Ball Dataset"
        ),

        DTOutput(
          "ball_data"
        )
      )

    ),


    # ========================================================
    # ABOUT
    # ========================================================

    tabPanel(

      "About",

      div(
        class = "hero",

        div(
          class = "hero-content",

          div(
            class = "hero-kicker",
            "ACADEMIC BIG DATA ANALYTICS PROJECT"
          ),

          div(
            class = "hero-title",
            "IPL Cricket Data Analytics"
          ),

          div(
            class = "hero-subtitle",
            "A complete Big Data pipeline for analyzing IPL match-level and ball-by-ball cricket data."
          )
        )
      ),


      div(
        class = "info-box",

        h2(
          "🎯 Project Objective"
        ),

        p(
          "The objective of this project is to analyze IPL cricket data and identify meaningful patterns in team performance, player performance, scoring, bowling, venues, seasons and match phases."
        ),

        p(
          "The project demonstrates how Big Data technologies can be combined with interactive visualization to transform raw cricket data into useful analytical insights."
        )
      ),


      div(
        class = "section-header",

        div(class = "section-dot"),

        div(
          class = "section-title",
          "Technology Stack"
        )
      ),


      div(
        class = "tech-grid",

        div(
          class = "tech-card",

          div(
            class = "tech-icon",
            "🗄️"
          ),

          div(
            class = "tech-name",
            "HDFS"
          ),

          div(
            class = "tech-desc",
            "Distributed storage for IPL datasets."
          )
        ),


        div(
          class = "tech-card",

          div(
            class = "tech-icon",
            "⚙️"
          ),

          div(
            class = "tech-name",
            "MapReduce"
          ),

          div(
            class = "tech-desc",
            "Batch processing and aggregation of large datasets."
          )
        ),


        div(
          class = "tech-card",

          div(
            class = "tech-icon",
            "🔍"
          ),

          div(
            class = "tech-name",
            "Hive"
          ),

          div(
            class = "tech-desc",
            "SQL-based querying and descriptive analysis."
          )
        ),


        div(
          class = "tech-card",

          div(
            class = "tech-icon",
            "⚡"
          ),

          div(
            class = "tech-name",
            "PySpark"
          ),

          div(
            class = "tech-desc",
            "Large-scale processing and exploratory analytics."
          )
        ),


        div(
          class = "tech-card",

          div(
            class = "tech-icon",
            "📊"
          ),

          div(
            class = "tech-name",
            "R Shiny"
          ),

          div(
            class = "tech-desc",
            "Interactive analytics dashboard and visualization."
          )
        )

      ),


      div(
        class = "info-box",

        h3(
          "🔄 Data Processing Pipeline"
        ),

        p(
          strong("IPL Dataset → Data Cleaning → HDFS → MapReduce / Hive / PySpark → Analytical Results → R Shiny Dashboard")
        ),

        p(
          "HDFS provides distributed storage, MapReduce performs batch processing, Hive provides SQL-based analytics, PySpark performs large-scale data processing and R Shiny provides the interactive visualization layer."
        )
      ),


      div(
        class = "footer",
        "IPL BDA Analytics • Hadoop • Hive • PySpark • R Shiny"
      )

    )

  )
)


# ============================================================
# SERVER
# ============================================================

server <- function(input, output, session) {


  # ==========================================================
  # DASHBOARD KPIs
  # ==========================================================

  output$kpi_matches <- renderText({

    format(
      nrow(matches),
      big.mark = ","
    )

  })


  output$kpi_seasons <- renderText({

    length(
      unique(matches$season)
    )

  })


  output$kpi_deliveries <- renderText({

    format(
      nrow(balls),
      big.mark = ","
    )

  })


  output$kpi_runs <- renderText({

    format(
      sum(
        balls$total_runs,
        na.rm = TRUE
      ),
      big.mark = ","
    )

  })


  # ==========================================================
  # BOWLING KPIs
  # ==========================================================

  output$kpi_wickets <- renderText({

    format(
      sum(
        balls$wicket_count,
        na.rm = TRUE
      ),
      big.mark = ","
    )

  })


  output$kpi_dots <- renderText({

    format(
      sum(
        balls$is_dot_ball,
        na.rm = TRUE
      ),
      big.mark = ","
    )

  })


  output$kpi_boundaries <- renderText({

    boundaries <-
      sum(
        balls$is_boundary_4,
        na.rm = TRUE
      ) +

      sum(
        balls$is_boundary_6,
        na.rm = TRUE
      )

    format(
      boundaries,
      big.mark = ","
    )

  })


  # ==========================================================
  # MATCHES BY SEASON
  # ==========================================================

  output$season_matches_plot <- renderPlot({

    data <- matches %>%
      count(
        season,
        name = "Matches"
      )

    ggplot(
      data,
      aes(
        x = season,
        y = Matches,
        group = 1
      )
    ) +

      geom_area(
        fill = "#dbeafe",
        alpha = 0.65
      ) +

      geom_line(
        color = "#2563eb",
        linewidth = 1.4
      ) +

      geom_point(
        color = "#1d4ed8",
        size = 2.7
      ) +

      premium_theme(12) +

      labs(
        x = "Season",
        y = "Matches"
      ) +

      theme(
        axis.text.x =
          element_text(
            angle = 45,
            hjust = 1
          )
      )

  })


  # ==========================================================
  # TOP WINNING TEAMS
  # ==========================================================

  output$top_winners_plot <- renderPlot({

    data <- matches %>%
      filter(
        !is.na(winner),
        winner != ""
      ) %>%
      count(
        winner,
        sort = TRUE
      ) %>%
      head(10)

    ggplot(
      data,
      aes(
        x = reorder(winner, n),
        y = n
      )
    ) +

      geom_col(
        fill = "#2563eb",
        width = 0.72
      ) +

      coord_flip() +

      premium_theme(12) +

      labs(
        x = "Team",
        y = "Wins"
      )

  })


  # ==========================================================
  # TEAM WINS
  # ==========================================================

  output$team_wins_plot <- renderPlot({

    data <- matches


    if (
      input$season_filter != "All Seasons"
    ) {

      data <- data %>%
        filter(
          season == input$season_filter
        )

    }


    if (
      input$team_filter != "All Teams"
    ) {

      data <- data %>%
        filter(
          winner == input$team_filter
        )

    }


    data <- data %>%
      filter(
        !is.na(winner),
        winner != ""
      ) %>%
      count(
        winner,
        sort = TRUE
      )


    if (
      nrow(data) == 0
    ) {

      plot.new()

      text(
        0.5,
        0.5,
        "No data available"
      )

      return()

    }


    ggplot(
      data,
      aes(
        x = reorder(winner, n),
        y = n
      )
    ) +

      geom_col(
        fill = "#2563eb",
        width = 0.7
      ) +

      coord_flip() +

      premium_theme(12) +

      labs(
        x = "Team",
        y = "Wins"
      )

  })


  # ==========================================================
  # TEAM PARTICIPATION
  # ==========================================================

  output$team_matches_plot <- renderPlot({

    data <- matches


    if (
      input$season_filter != "All Seasons"
    ) {

      data <- data %>%
        filter(
          season == input$season_filter
        )

    }


    data <- bind_rows(

      data.frame(
        Team = data$team1
      ),

      data.frame(
        Team = data$team2
      )

    ) %>%

      filter(
        !is.na(Team),
        Team != ""
      ) %>%

      count(
        Team,
        sort = TRUE
      )


    if (
      input$team_filter != "All Teams"
    ) {

      data <- data %>%
        filter(
          Team == input$team_filter
        )

    }


    ggplot(
      data,
      aes(
        x = reorder(Team, n),
        y = n
      )
    ) +

      geom_col(
        fill = "#4f46e5",
        width = 0.7
      ) +

      coord_flip() +

      premium_theme(12) +

      labs(
        x = "Team",
        y = "Matches"
      )

  })


  # ==========================================================
  # TEAM TABLE
  # ==========================================================

  output$team_table <- renderDT({

    data <- matches


    if (
      input$season_filter != "All Seasons"
    ) {

      data <- data %>%
        filter(
          season == input$season_filter
        )

    }


    result <- data %>%

      group_by(
        winner
      ) %>%

      summarise(
        Wins = n(),
        .groups = "drop"
      ) %>%

      filter(
        !is.na(winner),
        winner != ""
      ) %>%

      arrange(
        desc(Wins)
      )


    names(result)[1] <- "Team"


    datatable(

      result,

      rownames = FALSE,

      options = list(
        pageLength = 10,
        scrollX = TRUE,
        autoWidth = TRUE
      )

    )

  })


  # ==========================================================
  # TOP BATTERS
  # ==========================================================

  output$top_batters_plot <- renderPlot({

    data <- balls %>%

      group_by(
        batter
      ) %>%

      summarise(
        Runs =
          sum(
            batter_runs,
            na.rm = TRUE
          ),
        .groups = "drop"
      ) %>%

      arrange(
        desc(Runs)
      ) %>%

      head(10)


    ggplot(
      data,
      aes(
        x = reorder(batter, Runs),
        y = Runs
      )
    ) +

      geom_col(
        fill = "#2563eb",
        width = 0.7
      ) +

      coord_flip() +

      premium_theme(12) +

      labs(
        x = "Batter",
        y = "Runs"
      )

  })


  # ==========================================================
  # TOP BOWLERS BY DELIVERIES
  # ==========================================================

  output$top_bowlers_plot <- renderPlot({

    data <- balls %>%

      count(
        bowler,
        sort = TRUE
      ) %>%

      head(10)


    ggplot(
      data,
      aes(
        x = reorder(bowler, n),
        y = n
      )
    ) +

      geom_col(
        fill = "#4f46e5",
        width = 0.7
      ) +

      coord_flip() +

      premium_theme(12) +

      labs(
        x = "Bowler",
        y = "Deliveries"
      )

  })


  # ==========================================================
  # PLAYER TABLE
  # ==========================================================

  output$player_table <- renderDT({

    data <- balls %>%

      group_by(
        batter
      ) %>%

      summarise(

        Runs =
          sum(
            batter_runs,
            na.rm = TRUE
          ),

        Balls =
          n(),

        Fours =
          sum(
            is_boundary_4,
            na.rm = TRUE
          ),

        Sixes =
          sum(
            is_boundary_6,
            na.rm = TRUE
          ),

        .groups = "drop"

      ) %>%

      mutate(

        Strike_Rate =
          round(
            Runs /
              Balls *
              100,
            2
          )

      ) %>%

      arrange(
        desc(Runs)
      )


    datatable(

      data,

      rownames = FALSE,

      options = list(
        pageLength = 15,
        scrollX = TRUE,
        autoWidth = TRUE
      )

    )

  })


  # ==========================================================
  # BATTER RUNS
  # ==========================================================

  output$batter_runs_plot <- renderPlot({

    data <- balls %>%

      group_by(
        batter
      ) %>%

      summarise(
        Runs =
          sum(
            batter_runs,
            na.rm = TRUE
          ),
        .groups = "drop"
      ) %>%

      arrange(
        desc(Runs)
      ) %>%

      head(15)


    ggplot(
      data,
      aes(
        x = reorder(batter, Runs),
        y = Runs
      )
    ) +

      geom_col(
        fill = "#2563eb",
        width = 0.68
      ) +

      coord_flip() +

      premium_theme(12) +

      labs(
        x = "Batter",
        y = "Runs"
      )

  })


  # ==========================================================
  # BOUNDARY ANALYSIS
  # ==========================================================

  output$boundary_plot <- renderPlot({

    data <- data.frame(

      Type = c(
        "Fours",
        "Sixes"
      ),

      Count = c(

        sum(
          balls$is_boundary_4,
          na.rm = TRUE
        ),

        sum(
          balls$is_boundary_6,
          na.rm = TRUE
        )

      )

    )


    ggplot(
      data,
      aes(
        x = Type,
        y = Count,
        fill = Type
      )
    ) +

      geom_col(
        width = 0.55,
        show.legend = FALSE
      ) +

      scale_fill_manual(
        values = c(
          "Fours" = "#2563eb",
          "Sixes" = "#4f46e5"
        )
      ) +

      premium_theme(13) +

      labs(
        x = "Boundary Type",
        y = "Count"
      )

  })


  # ==========================================================
  # RUN TYPE DISTRIBUTION
  # ==========================================================

  output$run_type_plot <- renderPlot({

    data <- balls %>%

      mutate(

        Run_Type = case_when(

          batter_runs == 0 ~
            "Dot Ball",

          batter_runs == 1 ~
            "1 Run",

          batter_runs == 2 ~
            "2 Runs",

          batter_runs == 3 ~
            "3 Runs",

          batter_runs == 4 ~
            "Four",

          batter_runs == 6 ~
            "Six",

          TRUE ~
            "Other"

        )

      ) %>%

      count(
        Run_Type,
        sort = TRUE
      )


    ggplot(
      data,
      aes(
        x = reorder(
          Run_Type,
          n
        ),
        y = n
      )
    ) +

      geom_col(
        fill = "#2563eb",
        width = 0.68
      ) +

      coord_flip() +

      premium_theme(12) +

      labs(
        x = "Run Type",
        y = "Deliveries"
      )

  })


  # ==========================================================
  # TOP BOWLERS BY WICKETS
  # ==========================================================

  output$wicket_bowlers_plot <- renderPlot({

    data <- balls %>%

      group_by(
        bowler
      ) %>%

      summarise(

        Wickets =
          sum(
            wicket_count,
            na.rm = TRUE
          ),

        .groups = "drop"

      ) %>%

      arrange(
        desc(Wickets)
      ) %>%

      head(10)


    ggplot(
      data,
      aes(
        x = reorder(
          bowler,
          Wickets
        ),
        y = Wickets
      )
    ) +

      geom_col(
        fill = "#4f46e5",
        width = 0.7
      ) +

      coord_flip() +

      premium_theme(12) +

      labs(
        x = "Bowler",
        y = "Wickets"
      )

  })


  # ==========================================================
  # WICKETS BY PHASE
  # ==========================================================

  output$phase_wickets_plot <- renderPlot({

    data <- balls %>%

      group_by(
        phase
      ) %>%

      summarise(

        Wickets =
          sum(
            wicket_count,
            na.rm = TRUE
          ),

        .groups = "drop"
      )


    ggplot(
      data,
      aes(
        x = phase,
        y = Wickets,
        fill = phase
      )
    ) +

      geom_col(
        show.legend = FALSE,
        width = 0.62
      ) +

      scale_fill_manual(
        values = c(
          "Powerplay" = "#2563eb",
          "Middle Overs" = "#4f46e5",
          "Death Overs" = "#1e40af"
        )
      ) +

      premium_theme(13) +

      labs(
        x = "Match Phase",
        y = "Wickets"
      )

  })


  # ==========================================================
  # VENUE ANALYSIS
  # ==========================================================

  output$venue_plot <- renderPlot({

    data <- matches %>%

      filter(
        !is.na(venue),
        venue != ""
      ) %>%

      count(
        venue,
        sort = TRUE
      ) %>%

      head(15)


    ggplot(
      data,
      aes(
        x = reorder(
          venue,
          n
        ),
        y = n
      )
    ) +

      geom_col(
        fill = "#2563eb",
        width = 0.7
      ) +

      coord_flip() +

      premium_theme(12) +

      labs(
        x = "Venue",
        y = "Matches"
      )

  })


  # ==========================================================
  # VENUE TABLE
  # ==========================================================

  output$venue_table <- renderDT({

    data <- matches %>%

      filter(
        !is.na(venue),
        venue != ""
      ) %>%

      count(
        venue,
        sort = TRUE
      )


    names(data) <-
      c(
        "Venue",
        "Matches"
      )


    datatable(

      data,

      rownames = FALSE,

      options = list(
        pageLength = 15,
        scrollX = TRUE,
        autoWidth = TRUE
      )

    )

  })


  # ==========================================================
  # RUNS BY PHASE
  # ==========================================================

  output$phase_runs_plot <- renderPlot({

    data <- balls %>%

      group_by(
        phase
      ) %>%

      summarise(

        Runs =
          sum(
            total_runs,
            na.rm = TRUE
          ),

        .groups = "drop"

      )


    ggplot(
      data,
      aes(
        x = phase,
        y = Runs,
        fill = phase
      )
    ) +

      geom_col(
        show.legend = FALSE,
        width = 0.62
      ) +

      scale_fill_manual(
        values = c(
          "Powerplay" = "#2563eb",
          "Middle Overs" = "#4f46e5",
          "Death Overs" = "#1e40af"
        )
      ) +

      premium_theme(13) +

      labs(
        x = "Match Phase",
        y = "Total Runs"
      )

  })


  # ==========================================================
  # PHASE WICKETS
  # ==========================================================

  output$phase_wickets_chart <- renderPlot({

    data <- balls %>%

      group_by(
        phase
      ) %>%

      summarise(

        Wickets =
          sum(
            wicket_count,
            na.rm = TRUE
          ),

        .groups = "drop"

      )


    ggplot(
      data,
      aes(
        x = phase,
        y = Wickets,
        fill = phase
      )
    ) +

      geom_col(
        show.legend = FALSE,
        width = 0.62
      ) +

      scale_fill_manual(
        values = c(
          "Powerplay" = "#2563eb",
          "Middle Overs" = "#4f46e5",
          "Death Overs" = "#1e40af"
        )
      ) +

      premium_theme(13) +

      labs(
        x = "Match Phase",
        y = "Wickets"
      )

  })


  # ==========================================================
  # MATCH DATA
  # ==========================================================

  output$match_data <- renderDT({

    datatable(

      matches,

      rownames = FALSE,

      filter = "top",

      options = list(
        pageLength = 10,
        scrollX = TRUE,
        autoWidth = TRUE
      )

    )

  })


  # ==========================================================
  # BALL DATA
  # ==========================================================

  output$ball_data <- renderDT({

    datatable(

      balls,

      rownames = FALSE,

      filter = "top",

      options = list(
        pageLength = 10,
        scrollX = TRUE,
        autoWidth = TRUE
      )

    )

  })

}


# ============================================================
# START SHINY APPLICATION
# ============================================================

cat("\n")
cat("============================================\n")
cat(" IPL BDA PREMIUM SHINY DASHBOARD\n")
cat("============================================\n")

cat(
  "Matches:",
  format(nrow(matches), big.mark = ","),
  "\n"
)

cat(
  "Deliveries:",
  format(nrow(balls), big.mark = ","),
  "\n"
)

cat(
  "Dashboard ready.\n"
)

cat("============================================\n\n")


shinyApp(
  ui = ui,
  server = server
)
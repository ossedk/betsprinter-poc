-- Create the leagues table
CREATE TABLE leagues (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255),
  country VARCHAR(255),
  logo VARCHAR(255),
  flag VARCHAR(255),
  season INTEGER
);

-- Create the teams table
CREATE TABLE teams (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255),
  logo VARCHAR(255)
);

-- Create the standings table
CREATE TABLE standings (
  id SERIAL PRIMARY KEY,
  league_id INTEGER REFERENCES leagues(id),
  team_id INTEGER REFERENCES teams(id),
  rank INTEGER,
  points INTEGER,
  goals_diff INTEGER,
  form VARCHAR(255),
  status VARCHAR(255),
  description VARCHAR(255),
  all_played INTEGER,
  all_win INTEGER,
  all_draw INTEGER,
  all_lose INTEGER,
  all_goals_for INTEGER,
  all_goals_against INTEGER,
  home_played INTEGER,
  home_win INTEGER,
  home_draw INTEGER,
  home_lose INTEGER,
  home_goals_for INTEGER,
  home_goals_against INTEGER,
  away_played INTEGER,
  away_win INTEGER,
  away_draw INTEGER,
  away_lose INTEGER,
  away_goals_for INTEGER,
  away_goals_against INTEGER,
  last_update TIMESTAMP
);
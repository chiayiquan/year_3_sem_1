USE clf_crime_data;

DROP TABLE IF EXISTS raw_data;

CREATE TABLE raw_data (
  timestamp datetime,
  category varchar(64),
  description varchar(255),
  day_of_week varchar(16),
  district varchar(32),
  resolution varchar(64),
  address varchar(128), 
  latitude float, 
  longitude float,
  row_num int
);


LOAD DATA INFILE '/home/coder/project/mid-term/clf-crime-watch/data/tiny-clf-crime-data.csv'
INTO TABLE raw_data
FIELDS TERMINATED BY ','
ENCLOSED BY ''
LINES TERMINATED BY '\n'
IGNORE 1 LINES;


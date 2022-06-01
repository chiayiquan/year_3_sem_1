
USE clf_crime_data;

DROP TABLE IF EXISTS dnorm_data;
DROP TABLE IF EXISTS offences;
DROP TABLE IF EXISTS resolutions;
DROP TABLE IF EXISTS offence_categories;
DROP TABLE IF EXISTS resolution_types;
DROP TABLE IF EXISTS incidences;
DROP TABLE IF EXISTS districts;
DROP TABLE IF EXISTS streets;
DROP TABLE IF EXISTS locations;


CREATE TABLE districts ( 
  district_id int PRIMARY KEY AUTO_INCREMENT,
  district_name varchar(32) UNIQUE NOT NULL
);


CREATE TABLE streets ( 
  street_id int PRIMARY KEY AUTO_INCREMENT,
  street_name varchar(32) NOT NULL,
  district_id int NOT NULL,
  CONSTRAINT uc_street_district UNIQUE(street_name, district_id)
);
ALTER TABLE streets ADD FOREIGN KEY (district_id) REFERENCES districts (district_id);
  

CREATE TABLE locations (  
  location_id int PRIMARY KEY AUTO_INCREMENT,
  spot varchar(32) NOT NULL,
  street_id int NOT NULL,
  latitude float NOT NULL,
  longitude float NOT NULL
  CONSTRAINT uc_location UNIQUE(spot, street_id, latitude, longitude)
);
ALTER TABLE locations ADD FOREIGN KEY (street_id) REFERENCES streets (street_id);

CREATE TABLE incidences (  
  incidence_id int PRIMARY KEY AUTO_INCREMENT,
  timestamp datetime NOT NULL,
  location_id int NOT NULL,
  description varchar(255) NOT NULL
);
ALTER TABLE incidences ADD FOREIGN KEY (location_id) REFERENCES locations (location_id);


CREATE TABLE offence_categories ( 
  category_id int PRIMARY KEY AUTO_INCREMENT,
  category_type varchar(64) UNIQUE NOT NULL
);

CREATE TABLE resolution_types ( 
  resolution_type_id int PRIMARY KEY AUTO_INCREMENT,
  resolution_type varchar(64) UNIQUE NOT NULL
);

CREATE TABLE offences (
  incidence_id int,
  category_id int,
  PRIMARY KEY (incidence_id, category_id)
);
ALTER TABLE offences ADD FOREIGN KEY (incidence_id) REFERENCES incidences (incidence_id);
ALTER TABLE offences ADD FOREIGN KEY (category_id) REFERENCES offence_categories (category_id);


CREATE TABLE resolutions ( 
  incidence_id  int,
  resolution_type_id int,
  PRIMARY KEY (incidence_id, resolution_type_id)
);
ALTER TABLE resolutions ADD FOREIGN KEY (incidence_id) REFERENCES incidences (incidence_id);
ALTER TABLE resolutions ADD FOREIGN KEY (resolution_type_id) REFERENCES resolution_types (resolution_type_id);


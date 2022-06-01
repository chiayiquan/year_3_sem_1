
USE clf_crime_data;

DROP TABLE IF EXISTS dnorm_data;


CREATE TABLE dnorm_data 
  AS ( WITH tbl AS ( SELECT row_num + 1 AS row_num,
                            timestamp,
							SUBSTRING_INDEX(SUBSTRING_INDEX(address, ' / ', 1), ' Block of ', 1) AS spot, 
							SUBSTRING_INDEX(SUBSTRING_INDEX(address, ' / ', -1), ' Block of ', -1) AS street,
							district,
							latitude,
							longitude,
							REPLACE(category, '/', ' ') AS category,
							REPLACE(resolution, '/', '') AS resolution, 
							REPLACE(description, '/', ' /') AS description	   
					 FROM raw_data
       )

       SELECT b.row_num, b.timestamp, b.spot, b.street, b.district, g.latitude, g.longitude, b.category, b.resolution, b.description
       FROM ( SELECT row_num, timestamp, spot, street, district, category, resolution, description
	          FROM tbl
       ) b 
       LEFT JOIN ( SELECT spot, street, district, AVG(latitude) AS latitude, AVG(longitude) AS longitude
	        FROM tbl
	        GROUP BY spot, street, district
       ) g
       ON b.spot = g.spot
       AND b.street = g.street
       AND b.district = g.district
 );



DELETE FROM districts;

INSERT INTO districts (district_name) 
  SELECT DISTINCT district
  FROM dnorm_data;


DELETE FROM streets;

INSERT INTO streets (street_name, district_id)
  SELECT s.street, d.district_id 
  FROM ( SELECT DISTINCT street, district
         FROM dnorm_data
  ) s
  LEFT JOIN districts d
  ON s.district = d.district_name;
  

DELETE FROM locations;
  
INSERT INTO locations (spot, street_id, latitude, longitude)
  SELECT dt.spot, sd.street_id, dt.latitude, dt.longitude 
  FROM ( SELECT DISTINCT spot, street, district, latitude, longitude
         FROM dnorm_data
  ) dt
  LEFT JOIN ( SELECT s.street_id, s.street_name, d.district_name
              FROM streets s
              LEFT JOIN districts d
	   ON s.district_id = d.district_id
  ) sd
  ON dt.street = sd.street_name
  AND dt.district = sd.district_name;
  
 
DELETE FROM incidences;

INSERT INTO incidences (incidence_id, timestamp, location_id, description)
  SELECT idt.row_num, idt.timestamp, lsd.location_id, idt.description
  FROM dnorm_data idt
  LEFT JOIN ( SELECT DISTINCT lc.location_id, lc.spot, s.street_name, d.district_name
              FROM locations lc
  	          LEFT JOIN streets s
	          ON lc.street_id = s.street_id
	          LEFT JOIN districts d
	          ON s.district_id = d.district_id
  ) lsd
  ON idt.spot = lsd.spot
  AND idt.street = lsd.street_name
  AND idt.district = lsd.district_name;



DELETE FROM offence_categories;
 
INSERT INTO offence_categories (category_type)
  SELECT DISTINCT category
  FROM dnorm_data;
  

DELETE FROM resolution_types;
 
INSERT INTO resolution_types (resolution_type)
  SELECT DISTINCT resolution
  FROM dnorm_data
  WHERE resolution NOT IN ('None');
  

DELETE FROM offences;

INSERT INTO offences (incidence_id, category_id)
  SELECT dt.row_num, o.category_id 
  FROM dnorm_data dt
  LEFT JOIN offence_categories o
  ON dt.category = o.category_type;
  
  
DELETE FROM resolutions;

INSERT INTO resolutions (incidence_id, resolution_type_id)
  SELECT dt.row_num, r.resolution_type_id 
  FROM ( SELECT row_num, resolution
         FROM dnorm_data 
		 WHERE LOWER(resolution) NOT LIKE '%none%'
  ) dt
  LEFT JOIN resolution_types r
  ON dt.resolution = r.resolution_type;
  


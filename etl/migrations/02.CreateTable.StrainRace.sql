
CREATE TABLE IF NOT EXISTS strain_race (  
   race_id BIGINT NOT NULL,  
		PRIMARY KEY (race_id),  
   code VARCHAR(100) NOT NULL,
   label VARCHAR(100) NOT NULL
); 

insert ignore into strain_race (race_id, code, label) values (1, 'sativa', 'Sativa');
insert ignore into strain_race (race_id, code, label) values (2, 'indica', 'Indica');
insert ignore into strain_race (race_id, code, label) values (3, 'hybrid', 'Hybrid');

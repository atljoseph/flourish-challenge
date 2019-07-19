
CREATE TABLE IF NOT EXISTS strain (  
   strain_id BIGINT NOT NULL AUTO_INCREMENT, 
		PRIMARY KEY (strain_id),
   name VARCHAR(100) NOT NULL, 
		UNIQUE KEY(name),
   race_id BIGINT NOT NULL,
		FOREIGN KEY fk_strain_race_id(race_id)
		REFERENCES strain_race(race_id)
		ON UPDATE CASCADE 
		ON DELETE RESTRICT 
); 

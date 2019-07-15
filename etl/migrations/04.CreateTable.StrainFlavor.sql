
CREATE TABLE IF NOT EXISTS strain_flavor (  
   flavor_id BIGINT NOT NULL AUTO_INCREMENT,  
		PRIMARY KEY (flavor_id),  
   strain_id BIGINT NOT NULL,
		FOREIGN KEY fk_strain_flavor_strain_id(strain_id)
		REFERENCES strain(strain_id)
		ON UPDATE CASCADE # allow cross table updates
		ON DELETE RESTRICT, # disallow cross-table deletes
   label VARCHAR(100) NOT NULL
); 

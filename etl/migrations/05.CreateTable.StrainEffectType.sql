
CREATE TABLE IF NOT EXISTS strain_effect_type (  
   effect_type_id BIGINT NOT NULL AUTO_INCREMENT,  
		PRIMARY KEY (effect_type_id),  
   code VARCHAR(100) NOT NULL,
   label VARCHAR(100) NOT NULL
); 

insert ignore into strain_effect_type (effect_type_id, code, label) values (1, 'positive', 'Positive');
insert ignore into strain_effect_type (effect_type_id, code, label) values (2, 'negative', 'Negative');
insert ignore into strain_effect_type (effect_type_id, code, label) values (3, 'medical', 'Medical');


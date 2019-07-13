
// import * as path from 'path'; 

import * as express from 'express';  
import * as helmet from 'helmet';  
import * as cors from 'cors';  
import * as compression from 'compression';  

import { requestLoggerMiddleware } from './middleware';
import { database } from './data';

const app = express();

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLoggerMiddleware);

// database.query('', 'CREATE DATABASE test CHARACTER SET utf8 COLLATE utf8_bin;');
// database.query('', `GRANT ALL PRIVILEGES ON test.* TO 'testuser'@'localhost' IDENTIFIED BY 'testpassword'`);
// database.query('test', `CREATE TABLE testy(  
//    test_id INT NOT NULL AUTO_INCREMENT,  
//    test_name VARCHAR(100) NOT NULL,  
//    PRIMARY KEY ( test_id )  
// )`);
database.query('test', 'select * from testy');

export default app;

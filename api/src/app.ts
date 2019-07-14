
import * as express from 'express';  
import * as helmet from 'helmet';  
import * as cors from 'cors';  
import * as compression from 'compression';  

import { requestLoggerMiddleware } from './middleware';

const app = express();

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middlewares
const globalMiddleWare = [requestLoggerMiddleware];
app.use(globalMiddleWare);

export default app;

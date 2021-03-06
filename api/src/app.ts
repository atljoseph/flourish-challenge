
import * as express from 'express';  
import * as helmet from 'helmet';  
import * as cors from 'cors';  
import * as compression from 'compression';  
import * as bodyParser from 'body-parser';  

import { requestLoggerMiddleware, allowCorsMiddleware } from './middleware';
import { applyRoutes } from './route';
import { errorHandler } from './error-handler';

const app = express();

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compression());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// middlewares
const globalMiddleWare = [allowCorsMiddleware, requestLoggerMiddleware];
app.use(globalMiddleWare);

// routes
applyRoutes(app);

// errors
app.use(errorHandler);

export default app;

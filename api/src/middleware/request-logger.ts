
import * as moment from 'moment';

export const requestLoggerMiddleware = (req, res, next) => {
    const path = req.url;
    const timestamp = moment().format('LL');
    const msg = `[${timestamp}] [Request] [${path}]`;
    console.log(msg);
    // console.log(req.url);
    // console.log(JSON.stringify(req.headers));
    // console.log(req.body);
    next();
};

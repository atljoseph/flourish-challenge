
export const requestLoggerMiddleware = (req, res, next) => {
    console.log(req.url);
    // console.log(req.headers);
    // console.log(req.body);
    next();
};

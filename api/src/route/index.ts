import { strainRoute } from './strain.route';

export const applyRoutes = (app: any) => {

    // main route
    // app.use('*/test', testRoute);
    app.use('*/strain', strainRoute);

    app.use('*', (req, res) => {
        const statusCode = 404;
        console.log(`${statusCode} - Route Match Not Found`);
        res.status(statusCode).send('404 Not Found');
    });
};

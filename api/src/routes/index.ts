import { strainRoute } from './strain.route';

export const applyRoutes = (app: any) => {
    // app.use('*/test', testRoute);
    app.use('*/strain', strainRoute);
};

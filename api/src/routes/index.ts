import { testRoute } from './test.route';

export const applyRoutes = (app: any) => {
    app.use('*/test', testRoute);
};

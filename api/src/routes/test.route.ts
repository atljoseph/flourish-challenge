import { Router } from 'express';

const route = Router();

route.get('/', [], async (req, res) => {
    res.send("HEY Ya'll!")
});

export const testRoute = route;
import { Router } from 'express';
import { authMiddleware } from './middlewares/authentication';

import sessionController from './controllers/SessionController';
import usersController from './controllers/UsersController';

const routes = Router();

routes.post('/auth', sessionController.store);
routes.post('/users', usersController.create);

routes.use(authMiddleware);
routes.get('/dashboard', (_, res) => {
    return res.status(200).send();
});

export default routes;

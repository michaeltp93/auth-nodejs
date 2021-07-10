import { Request, Response } from 'express';
import UserService from '../services/UsersService';

class UserController {
    async create(req: Request, res: Response): Promise<Response> {
        const { email, name, password } = req.body;

        const user = { email, name, password };

        const usersServices = new UserService();

        const userCreated = await usersServices.create(user);

        return res.status(200).json(userCreated);
    }
}

export default new UserController();

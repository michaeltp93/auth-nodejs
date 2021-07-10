import { Request, Response } from 'express';
import UserService from '../services/UsersService';
import JWT from 'jsonwebtoken';

class SessionController {
    async store(req: Request, res: Response) {
        const { email, password } = req.body;

        const usersServices = new UserService();

        const user = await usersServices.getByEmail(email);

        if (!user) return res.status(404).json({ messsage: 'User not found' });

        const isValidPassword = await usersServices.checkPassword(password, user);

        if (!isValidPassword) return res.status(401).json({ message: 'UNAUTHORIZED' });

        const token = JWT.sign({ id: user.id }, process.env.JWT_SECRET as string);

        res.setHeader('access-token', token);
        return res.status(200).send();
    }
}

export default new SessionController();

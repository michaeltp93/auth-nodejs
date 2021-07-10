import { NextFunction, Request, Response } from 'express';
import JWT, { JsonWebTokenError } from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction): Response | void {
    const authenticationHeader = req.headers.authorization;

    if (!authenticationHeader) return res.status(401).json({ message: 'Token not provided.' });

    const [, token] = authenticationHeader.split(' ');

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET as string) as Record<
            string,
            string
        >;

        Object.assign(req, { id: decoded.id });

        return next();
    } catch (e) {
        if (e instanceof JsonWebTokenError)
            return res.status(401).json({ message: 'Invalid Token' });

        return res.status(401).json({ message: 'UNAUTHORIZED.' });
    }
}

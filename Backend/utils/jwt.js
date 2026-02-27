import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from '../config/index.js';

export const generateAccessJWT = (userID) => {
    const payload = { id: userID };

    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
        expiresIn: '24h',
    });
};
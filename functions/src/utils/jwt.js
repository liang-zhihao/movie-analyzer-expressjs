import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET;

export const signJWT = (payload, expiresIn='1h') => {
    return jwt.sign(payload, secret, { expiresIn });
}

export const verifyJWT = (token) => {
    return jwt.verify(token, secret);
}

export const refreshToken = (oldToken) => {
    const decoded = jwt.verify(oldToken, secret);
    delete decoded.iat;
    delete decoded.exp;
    return signJWT(decoded);
}

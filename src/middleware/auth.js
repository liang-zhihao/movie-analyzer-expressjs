import jwt from "jsonwebtoken";
import knex from "../config/db.js";

import dayjs from "dayjs";

const verifyToken = (token) => new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            reject(err);
        } else {
            resolve(user);
        }
    });
});

const isTokenInDB = async (token, userId) => {

    // Check if token is in the database and token belongs to the user
    const bearerToken = await knex('tokens')
        .where({
            bearer_token: token,
            user_id: userId
        })
        .first();
    // Check if token is in the database
    const refreshToken = await knex('tokens')
        .where({
            refresh_token: token,
            user_id: userId
        })
        .first();
    const isExisted = bearerToken || refreshToken;

    let isNotExpired = true;
    if (bearerToken) {
        // use dayjs to check bearerToken.bearer_expiry is expired
        isNotExpired = dayjs().isBefore(dayjs(bearerToken.bearer_expiry));
    } else if (refreshToken) {
        // use dayjs to check refreshToken.refresh_expiry is expired
        isNotExpired = dayjs().isBefore(dayjs(refreshToken.refresh_expiry));
    }

    return isExisted && isNotExpired;
}

const auth = (requireToken = true, forProfile = false) => {
    return async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        // people routes and without auth header
        if ((!authHeader && !forProfile)
            // people routes and with auth header but not bearer
            || (authHeader && !authHeader.startsWith('Bearer ') && !forProfile)
            // update profile routes and without auth header
            || (requireToken && forProfile && !authHeader)) {
            return res.status(401).json({
                error: true,
                message: "Authorization header ('Bearer token') not found"
            });
        }
        // get profile routes and without auth header
        if (!authHeader && !requireToken) {
            return next();
        }
        // get profile and update profile routes and with auth header but not bearer
        if (authHeader && !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                "error": true,
                "message": "Authorization header is malformed"
            });
        }
        const token = authHeader.split(' ')[1];
        try {
            const user = await verifyToken(token);
            if (!await isTokenInDB(token, user.id)) {
                return res.status(401).json({
                    "error": true,
                    "message": "JWT token has expired"
                });
            }
            req.user = user;
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    "error": true,
                    "message": "JWT token has expired"
                });
            }
            return res.status(401).json({
                "error": true,
                "message": "Invalid JWT token"
            });
        }
    };
};
const authForUpdateProfile = auth(true, true);

const authForGetProfile = auth(false, true);

const authForPeople = auth(true, false);

export {authForGetProfile, authForPeople, authForUpdateProfile};


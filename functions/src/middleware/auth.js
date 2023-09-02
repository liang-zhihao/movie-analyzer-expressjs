import jwt from "jsonwebtoken";
import knex from "../config/db.js";

import dayjs from "dayjs";

const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });

const isTokenInDB = async (refreshToken, userId) => {
  // Check if token is in the database
  const isExisted = await knex("tokens")
    .where({
      refresh_token: refreshToken,
      user_id: userId,
    })
    .first();

  let isNotExpired = true;
  if (refreshToken) {
    // use dayjs to check refreshToken.refresh_expiry is expired
    isNotExpired = dayjs().isBefore(dayjs(refreshToken.refresh_expiry));
  }

  return isExisted && isNotExpired;
};

const auth = (requireToken = true, forProfile = false) => {
  return async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    // people routes and without auth header
    if (
      (!authHeader && !forProfile) ||
      // people routes and with auth header but not bearer
      (authHeader && !authHeader.startsWith("Bearer ") && !forProfile) ||
      // update profile routes and without auth header
      (requireToken && forProfile && !authHeader)
    ) {
      return res.status(401).json({
        error: true,
        message: "Authorization header ('Bearer token') not found",
      });
    }
    // get profile routes and without auth header
    if (!authHeader && !requireToken) {
      return next();
    }
    // get profile and update profile routes and with auth header but not bearer
    if (authHeader && !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: true,
        message: "Authorization header is malformed",
      });
    }
    const token = authHeader.split(" ")[1];
    try {
      const user = await verifyToken(token);
      req.user = user;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          error: true,
          message: "JWT token has expired",
        });
      }
      console.log(err);
      return res.status(401).json({
        error: true,
        message: "Invalid JWT token: 5",
      });
    }
  };
};
const authForUpdateProfile = auth(true, true);

const authForGetProfile = auth(false, true);

const authForPeople = auth(true, false);

export { authForGetProfile, authForPeople, authForUpdateProfile, auth };

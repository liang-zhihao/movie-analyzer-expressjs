import jwt from "jsonwebtoken";
import knex from "../config/db.js";
import dayjs from "dayjs";
import { initializeApp, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { genUUID } from "../utils/uuid.js";
const SECRET_KEY = process.env.SECRET_KEY; // replace it with your actual key
const LONG_EXPIRY_TIME_S = 31536000; // seconds
const LONG_EXPIRY_TIME_MS = 31536000000; // milliseconds
const SHORT_EXPIRY_TIME_BEARER_S = 600;
const SHORT_EXPIRY_TIME_BEARER_MS = 600000; // milliseconds
const SHORT_EXPIRY_TIME_REFRESH_S = 86400;
const SHORT_EXPIRY_TIME_REFRESH_MS = 86400000; // milliseconds

function isValidDate(date, format) {
  return dayjs(date, format).format(format) === date;
}

async function storeToken(user, refreshToken, refreshExpiry) {
  // Delete existing tokens
  await knex("tokens").where("user_id", user.id).del();

  // Store tokens in database
  await knex("tokens").insert({
    id: genUUID(),
    user_id: user.id,
    refresh_token: refreshToken,
    refresh_expiry: new Date(Date.now() + refreshExpiry),
    revoked: false,
  });
}

async function respondWithTokens(
  res,
  data,
  bearerToken,
  refreshToken,
  bearerExpiresIn,
  refreshExpiresIn
) {
  res.json({
    ...data,
    bearerToken: {
      token: bearerToken,
      token_type: "Bearer",
      expires_in: bearerExpiresIn,
    },
    refreshToken: {
      token: refreshToken,
      token_type: "Refresh",
      expires_in: refreshExpiresIn,
    },
  });
}

class UsersController {
  // other functions here...

  async getProfile(req, res) {
    try {
      const { email } = req.params;

      const userDb = await knex("users").where({ email }).first();

      if (!userDb) {
        return res.status(404).json({ error: true, message: "User not found" });
      }

      // If there was an ‘Authorization:’ header, but it did not contain ‘Bearer ‘ followed by the JWT
      let userToReturn = {
        email: userDb.email,
        firstName: userDb.firstName,
        lastName: userDb.lastName,
        username: userDb.username,
      };
      if (req.user && req.user.email === userDb.email) {
        userToReturn = {
          ...userToReturn,
          dob: userDb.dob ? dayjs(userDb.dob).format("YYYY-MM-DD") : null,
          address: userDb.address,
        };

        return res.status(200).json(userToReturn);
      }

      return res.status(200).json(userToReturn);
    } catch (err) {
      res.status(500).json({ error: true, message: err.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const { email } = req.params;

      const { firstName, lastName, dob, address } = req.body;

      const user = await knex("users").where({ email }).first();

      if (!user) {
        return res.status(404).json({ error: true, message: "User not found" });
      }

      if (req.user && req.user.email !== user.email) {
        return res.status(403).json({ error: true, message: "Forbidden" });
      }

      if (!firstName || !lastName || !dob || !address) {
        return res.status(400).json({
          error: true,
          message:
            "Request body incomplete: firstName, lastName, dob and address are required.",
        });
      }

      if (
        typeof firstName !== "string" ||
        typeof lastName !== "string" ||
        typeof dob !== "string" ||
        typeof address !== "string"
      ) {
        return res.status(400).json({
          error: true,
          message:
            "Request body invalid: firstName, lastName and address must be strings only.",
        });
      }

      // If the date of birth is not a valid YYYY-MM-DD date (e.g. no April 31 or February 30, or February 29 on
      // a non-leap year):
      //  AND
      // use dayjs check non-real date (out of bounds check) 2021-13-32

      const dobRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (!dobRegex.test(dob) || !isValidDate(dob, "YYYY-MM-DD")) {
        return res.status(400).json({
          error: true,
          message:
            "Invalid input: dob must be a real date in format YYYY-MM-DD.",
        });
      }

      // valid date in the future
      const dobDate = new Date(dob);
      if (dobDate > new Date()) {
        return res.status(400).json({
          error: true,
          message: "Invalid input: dob must be a date in the past.",
        });
      }
      await knex("users")
        .where({ email })
        .update({ firstName, lastName, dob, address });

      res.json({
        email,
        firstName,
        lastName,
        dob,
        address,
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: true, message: "An error occurred" });
    }
  }

  async register(req, res) {
    try {
      if (!req.body.email || !req.body.username) {
        res.status(400).json({
          error: true,
          message:
            "Request body incomplete, both email and username are required",
        });
        return;
      }
      // const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await knex("users").insert({
        id: genUUID(),
        email: req.body.email,
        username: req.body.username,
        auth_provider: req.body.authProvider,
        uid: req.body.uid,
        avatar:req.body.avatar,
        created_at: new Date(),
      });

      res.status(201).json({ message: "User created" });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async login(req, res) {
    try {
      //
      // Invalid log in request

      if (!req.body.email || !req.body.idToken) {
        res.status(400).json({
          error: true,
          message:
            "Request body incomplete, both email and idToken are required",
        });
        return;
      }

      let user = await knex("users").where("email", req.body.email).first();
      if (!user) {
        res.status(401).json({
          error: true,
          message: "Incorrect email",
        });
        return;
      }

      const idToken = req.body.idToken;
      const app = appSingleton();
      user = await getAuth(app)
        .verifyIdToken(idToken)
        .then(async (decodedToken) => {
          const uid = decodedToken.uid;
          const user = await knex("users").where("uid", uid).first();
          return user;
          // ...
        })
        .catch((error) => {
          // Handle error
        });

      if (!user) {
        res.status(401).json({
          error: true,
          message: "Incorrect id token",
        });
        return;
      }
      let bearerTokenExpiresInSeconds = SHORT_EXPIRY_TIME_BEARER_S;
      let refreshTokenExpiresInSeconds = SHORT_EXPIRY_TIME_REFRESH_S;
      if (req.body.longExpiry && req.body.longExpiry === "true") {
        bearerTokenExpiresInSeconds = LONG_EXPIRY_TIME_S;
        refreshTokenExpiresInSeconds = LONG_EXPIRY_TIME_S;
      }

      if (req.body.refreshExpiresInSeconds) {
        refreshTokenExpiresInSeconds = Number(req.body.refreshExpiresInSeconds);
      }
      if (req.body.bearerExpiresInSeconds) {
        bearerTokenExpiresInSeconds = Number(req.body.bearerExpiresInSeconds);
      }

      let bearerToken = "";
      let refreshToken = "";

      bearerToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        SECRET_KEY,
        { expiresIn: bearerTokenExpiresInSeconds }
      );
      refreshToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        SECRET_KEY,
        { expiresIn: refreshTokenExpiresInSeconds }
      );

      await storeToken(user, refreshToken, refreshTokenExpiresInSeconds * 1000);
      const data = {
        id: user.id,
        username: user.username,
        email: user.email,
      };
      await respondWithTokens(
        res,
        data,
        bearerToken,
        refreshToken,
        bearerTokenExpiresInSeconds,
        refreshTokenExpiresInSeconds
      );
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  }

  async logout(req, res) {
    try {
      // Invalid refresh request
      if (!req.body.refreshToken) {
        return res.status(400).json({
          error: true,
          message: "Request body incomplete, refresh token required",
        });
      }

      const refreshToken = req.body.refreshToken;
      const user = jwt.verify(refreshToken, SECRET_KEY, async (error, user) => {
        if (error) {
          if (error.name === "TokenExpiredError") {
            return res.status(401).json({
              error: true,
              message: "JWT token has expired",
            });
          }
          return res
            .status(401)
            .json({ error: true, message: "Invalid JWT token: 4" });
        }
        // Check if refresh token exists in database
        const token = await knex("tokens")
          .where("refresh_token", refreshToken)
          .first();
        if (!token) {
          return res.status(401).json({
            error: true,
            message: "JWT token has expired",
          });
        }

        // Delete tokens from database
        await knex("tokens").where("user_id", user.id).del();
        res.json({ error: false, message: "Token successfully invalidated" });
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  async refreshToken(req, res) {
    try {
      //

      const refreshToken = req.body.refreshToken;
      if (!refreshToken || typeof refreshToken !== "string") {
        return res.status(400).json({
          error: true,
          message: "Request body incomplete, refresh token required",
        });
      }

      jwt.verify(refreshToken, SECRET_KEY, async (error, user) => {
        if (error) {
          if (error.name === "TokenExpiredError") {
            return res.status(401).json({
              error: true,
              message: "JWT token has expired",
            });
          }
          return res
            .status(401)
            .json({ error: true, message: "Invalid JWT token: 3" });
        }
        // Check if refresh token exists in database
        const token = await knex("tokens")
          .where("refresh_token", refreshToken)
          .first();
        if (!token) {
          return res.status(401).json({
            error: true,
            message: "JWT token has expired",
          });
        }
        const newBearerToken = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          SECRET_KEY,
          { expiresIn: SHORT_EXPIRY_TIME_BEARER_S }
        );
        const newRefreshToken = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          SECRET_KEY,
          { expiresIn: SHORT_EXPIRY_TIME_REFRESH_S }
        );

        // Update tokens in database
        await knex("tokens")
          .where("user_id", user.id)
          .update({
            refresh_token: newRefreshToken,
            refresh_expiry: new Date(Date.now() + SHORT_EXPIRY_TIME_REFRESH_MS), // 86400000 ms = 24 hours
          });
        respondWithTokens(
          res,
          {},
          newBearerToken,
          newRefreshToken,
          SHORT_EXPIRY_TIME_BEARER_S,
          SHORT_EXPIRY_TIME_REFRESH_S
        );
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

function appSingleton() {
  try {
    return getApp();
  } catch (err) {
    return initializeApp();
  }
}

export default new UsersController();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import * as functions from "firebase-functions";

// Import routes
import userRoutes from "./src/routes/users.js";
import movieRoutes from "./src/routes/movies.js";
// import swaggerDocument from './src/utils/swagger.js';
import peopleRoutes from "./src/routes/people.js";
import commentRoutes from "./src/routes/comments.js";

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// Import necessary libraries

// Load environment variables
dotenv.config();

// Swagger setup

// Initiate express app
const app = express();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

app.use(express.json());
// Routes

app.use("/user", userRoutes);
app.use("/movies", movieRoutes);
app.use("/people", peopleRoutes);
app.use("/comments", commentRoutes);

// Swagger API documentation
const swaggerDocument = YAML.load("./swagger.yaml");
app.all("/", (req, res) => {
  res.redirect("/docs");
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "Page not found!",
  });
});
// app.response.set("Access-Control-Allow-Origin", "*");
// Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });

// Listen to a port
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

export const webApi = functions.https.onRequest(app);

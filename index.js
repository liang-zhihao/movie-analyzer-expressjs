// Import necessary libraries
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import knex from './functions/src/config/db.js';
import YAML from 'yamljs';
import functions from 'firebase-functions' 

// Import routes
import userRoutes from './functions/src/routes/users.js';
import movieRoutes from './functions/src/routes/movies.js';
// import swaggerDocument from './src/utils/swagger.js';
import peopleRoutes from './functions/src/routes/people.js';
import commentRoutes from './functions/src/routes/comments.js';
// Load environment variables
dotenv.config();

// Swagger setup


// Initiate express app
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());
// Routes


app.use('/user', userRoutes);
app.use('/movies', movieRoutes);
app.use('/people', peopleRoutes);

// Swagger API documentation
const swaggerDocument = YAML.load('./swagger.yaml');
app.all('/', (req, res) => {
    res.redirect('/docs');
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use((req, res, next) => {
    res.status(404).json({
        "status": "error",
        "message": "Page not found!"
    });
});


// Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });

// Listen to a port
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
export const webApi = functions.https.onRequest(app);

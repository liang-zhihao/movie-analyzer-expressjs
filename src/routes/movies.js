import express from 'express';
import MoviesController from '../controllers/moviesController.js';


const router = express.Router();

router.get('/search', MoviesController.searchMovies);
router.get('/data/:imdbID', MoviesController.getMovieByImdbID);

export default router;

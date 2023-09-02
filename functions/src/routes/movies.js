import express from 'express';
import MoviesController from '../controllers/MoviesController.js';
import CommentsController from '../controllers/CommentsController.js';

const router = express.Router();

router.get('/search', MoviesController.searchMovies);
router.get('/data/:imdbID', MoviesController.getMovieByImdbID);
router.get("/:movieId/comments", CommentsController.fetchComments);

export default router;

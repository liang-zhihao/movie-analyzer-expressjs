import Movie from '../models/Movie.js';

class MoviesController {


    async searchMovies(req, res) {

        try {
            const {title, year, page} = req.query;
            // check year is Invalid year format. Format must be yyyy.
            if (year && !year.match(/^\d{4}$/)) {
                return res.status(400).json({
                    error: true,
                    message: 'Invalid year format. Format must be yyyy.'
                });
            }
            // check page is Invalid page format. Format must be number.
            if (page && !page.match(/^\d+$/)) {
                return res.status(400).json({
                    error: true,
                    message: 'Invalid page format. page must be a number.'
                });
            }

            const movies = await Movie.searchMovies(
                req.query.title,
                req.query.year,
                req.query.page,
                req.query.perPage
            );
            res.status(200).json(movies);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async getMovieByImdbID(req, res) {
        try {
            if (Object.keys(req.query).length !== 0) {
                return res.status(400).json({
                    error: true,
                    message: "Query parameters are not permitted."
                });
            }
            if (!await Movie.isMovieExisted(req.params.imdbID)) {
                return res.status(404).json({
                    "error": true,
                    "message": "No record exists of a movie with this ID"
                })
            }
            const movie = await Movie.getMovieData(req.params.imdbID);
            return res.status(200).json(movie);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }
}

export default new MoviesController();

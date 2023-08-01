import knex from '../config/db.js';
import {paginate} from '../utils/paginator.js';

class Movie {
    async searchMovies(title, year, page,) {
        const perPage = 100;
        if (!page || page < 1) {
            page = 1;
        }
        page = Number(page);


        const offset = (page - 1) * perPage;
        const movies = await knex('movies.basics')
            .select(
                'primaryTitle as title',
                'year',
                'tconst as imdbID',
                'imdbRating',
                'rottentomatoesRating as rottenTomatoesRating',
                'metacriticRating',
                'rated as classification'
            )
            .andWhere(builder => {
                if (year) {
                    builder.where('year', year);
                }
            })
            .andWhere(builder => {
                if (title) {
                    builder.where('primaryTitle', 'like', `%${title}%`)
                }
            })
            .offset(offset)
            .limit(perPage);
        for (let moviesKey in movies) {
            if (movies[moviesKey].imdbRating) {
                movies[moviesKey].imdbRating = Number(movies[moviesKey].imdbRating);
            }
            if (movies[moviesKey].rottenTomatoesRating) {
                movies[moviesKey].rottenTomatoesRating = Number(movies[moviesKey].rottenTomatoesRating);

            }
            if (movies[moviesKey].metacriticRating) {
                movies[moviesKey].metacriticRating = Number(movies[moviesKey].metacriticRating);
            }
        }

        const total = await knex('movies.basics')
            .count('* as count')
            .andWhere(builder => {
                if (year) {
                    builder.where('year', year);
                }
            })
            .andWhere(builder => {
                if (title) {
                    builder.where('primaryTitle', 'like', `%${title}%`)
                }
            })
            .first();
        return {
            data: movies,
            pagination: paginate(page, movies.length, total.count)
        };
    }

    async isMovieExisted(imdbID) {
        return knex('movies.basics')
            .select('*')
            .where('tconst', imdbID)
            .first();
    }

    async getMovieData(imdbID) {
        const movie = await knex('movies.basics')
            .select('*')
            .where('tconst', imdbID)
            .first();

        if (!movie) {
            throw new Error('No record exists of a movie with this ID');
        }

        const principals = await knex('movies.principals')
            .select(
                'nconst as id',
                'category',
                'name',
                'characters'
            )
            .where('tconst', imdbID);
        principals.forEach(role => {
            role.characters = role.characters ? JSON.parse(role.characters) : [];
        });
        const ratings = await knex('movies.ratings')
            .select(
                'source',
                'value'
            )
            .where('tconst', imdbID);
        ratings.forEach(rating => {
            if (rating.value.includes('/')) {
                rating.value = rating.value.split('/')[0];
            }
            if (rating.value.includes('%')) {
                rating.value = rating.value.replace('%', '');
            }
            rating.value = Number(rating.value);
        });
        return {
            title: movie.primaryTitle,
            year: movie.year,
            runtime: movie.runtimeMinutes,
            genres: movie.genres.split(','),
            country: movie.country,
            principals,
            ratings,
            boxoffice: movie.boxoffice,
            poster: movie.poster,
            plot: movie.plot
        };
    }


}


export default new Movie();

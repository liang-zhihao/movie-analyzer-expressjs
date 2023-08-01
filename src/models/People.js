import knex from '../config/db.js';


class People {

    async getPersonById(id) {
        const person = await knex('movies.names')
            .select('*')
            .where('nconst', id)
            .first();

        if (!person) {
            return null;
        }

        const roles = await knex('movies.principals')
            .select(
                'primaryTitle as movieName',
                'movies.basics.tconst as movieId',
                'category',
                'characters',
                'imdbRating'
            )
            .innerJoin('movies.basics', 'movies.principals.tconst', 'movies.basics.tconst')
            .where('nconst', id);

        roles.forEach(role => {
            role.characters = role.characters ? JSON.parse(role.characters) : [];
            role.imdbRating = Number(role.imdbRating);
        });
        return {
            name: person.primaryName,
            birthYear: person.birthYear,
            deathYear: person.deathYear,
            roles
        };
    }
}

export default new People();
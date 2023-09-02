import knex from '../config/db.js';


class People {

    async getPersonById(id) {
        const person = await knex('names')
            .select('*')
            .where('nconst', id)
            .first();

        if (!person) {
            return null;
        }

        const roles = await knex('principals')
            .select(
                'primaryTitle as movieName',
                'basics.tconst as movieId',
                'category',
                'characters',
                'imdbRating'
            )
            .innerJoin('basics', 'principals.tconst', 'basics.tconst')
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
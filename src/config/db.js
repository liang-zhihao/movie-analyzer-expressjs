import knex from 'knex';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import


dotenv.config()
// create the connection to database


const db = knex({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        port: 3306,
        database: 'movies'
    },
});

export default db;

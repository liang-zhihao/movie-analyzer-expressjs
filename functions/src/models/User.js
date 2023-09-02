import knex from '../config/db.js';

class User {
    constructor() {
        this.tableName = 'users'; // Assuming you have a users table
    }

    async getUserByEmail(email) {
        try {
            return await knex.select('*').from(this.tableName).where('email', email).first();
        } catch (error) {
            throw error;
        }
    }


}

export default new User();

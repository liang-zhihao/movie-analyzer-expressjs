import People from '../models/People.js';

class PeopleController {


    async getPersonById(req, res) {
        try {
            if (Object.keys(req.query).length !== 0) {
                return res.status(400).json({
                    error: true,
                    message: "Query parameters are not permitted."
                });
            }
            const people = await People.getPersonById(req.params.id);
            if (!people) {
                return res.status(404).json({
                    error: true,
                    message: "No record exists of a person with this ID"
                });
            }
            res.status(200).json(people);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

export default new PeopleController();

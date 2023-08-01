import express from 'express';
import {authForPeople} from '../middleware/auth.js';
import PeopleController from "../controllers/peopleController.js";

const router = express.Router();
router.get('/:id', authForPeople, PeopleController.getPersonById);

export default router;
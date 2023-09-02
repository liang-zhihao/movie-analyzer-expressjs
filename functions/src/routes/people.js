import express from 'express';
import {authForPeople} from '../middleware/auth.js';
import PeopleController from "../controllers/PeopleController.js";

const router = express.Router();
router.get('/:id', authForPeople, PeopleController.getPersonById);

export default router;
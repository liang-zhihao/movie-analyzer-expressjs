import express from 'express';
import UsersController from '../controllers/UsersController.js';
import {authForGetProfile, authForPeople, authForUpdateProfile} from '../middleware/auth.js';


const router = express.Router();




router.post('/register', UsersController.register);
router.post('/login', UsersController.login);
router.post('/refresh', UsersController.refreshToken);
router.post('/logout', UsersController.logout);


router.get('/:email/profile', authForGetProfile, UsersController.getProfile);
router.put('/:email/profile', authForUpdateProfile, UsersController.updateProfile);


export default router;

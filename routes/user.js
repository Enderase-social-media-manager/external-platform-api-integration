import express from 'express';
import { getUserData } from '../controllers/user.js';

const userRouters = express.Router();

userRouters.get('/', getUserData);

export default userRouters;

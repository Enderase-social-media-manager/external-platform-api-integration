import express from 'express';
import { createContent, deleteContent, updateContent } from '../controllers/content.js';

const contentRouters = express.Router();

//creating a post
contentRouters.post('/publish', createContent);
contentRouters.post('/update', updateContent);
contentRouters.post('/delete', deleteContent);


export default contentRouters;

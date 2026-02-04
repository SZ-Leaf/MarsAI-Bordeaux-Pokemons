import { Router } from 'express';
import { rateSubmission } from '../controllers/selector/selector_memo.controller.js';

const selectorRoutes = Router();


selectorRoutes.post('/rate/:id', rateSubmission);

export default selectorRoutes;


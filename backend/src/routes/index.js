import { Router } from 'express';
import tagsRoutes from './tags.routes.js'


const router = Router();


router.use('/tags',tagsRoutes);


export default router;

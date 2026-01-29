import { Router } from 'express';
import authRoutes from './auth/auth_routes.js';

const indexRoutes = Router();

indexRoutes.use('/auth', authRoutes);


export default indexRoutes;

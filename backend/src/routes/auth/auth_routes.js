import { Router } from 'express';
import { inviteUserController, registerUserController, deleteUserController } from '../../controllers/auth/user_controller.js';
import { loginUserController, updateUserPasswordController, forgotPasswordController, resetPasswordController } from '../../controllers/auth/user_controller.js';

const authRoutes = Router();

authRoutes.post('/invite', inviteUserController);
authRoutes.post('/register', registerUserController);
authRoutes.delete('/:id', deleteUserController);
authRoutes.post('/login', loginUserController);
// authRoutes.put('/:id', updateUserController);
authRoutes.patch('/password-update', updateUserPasswordController);
authRoutes.post('/forgot-password', forgotPasswordController);
authRoutes.post('/reset-password', resetPasswordController);
export default authRoutes;
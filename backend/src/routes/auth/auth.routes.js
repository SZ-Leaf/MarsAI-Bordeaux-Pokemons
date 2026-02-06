import { Router } from 'express';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import { inviteUserController,
   registerUserController,
   deleteUserController,
   updateUserController,
   updateUserPasswordController,
   loginUserController,
   forgotPasswordController,
   resetPasswordController,
   getAllUsersController, changeUserRoleController,
   logoutUserController
} from '../../controllers/auth/user.controller.js';

const authRoutes = Router();

authRoutes.post('/invite', authenticate, requireRole([2, 3]), inviteUserController);
authRoutes.post('/register', registerUserController);
authRoutes.delete('/:id', authenticate, deleteUserController); // Add authenticate middleware
authRoutes.post('/login', loginUserController);
authRoutes.post('/logout', authenticate, logoutUserController); // Add authenticate middleware
authRoutes.put('/:id', authenticate, updateUserController); // Add authenticate middleware
authRoutes.patch('/password-update', authenticate, updateUserPasswordController); // Add authenticate middleware
authRoutes.post('/forgot-password', forgotPasswordController);
authRoutes.post('/reset-password', resetPasswordController);
authRoutes.get('/users', authenticate, requireRole([2, 3]), getAllUsersController); // Add authenticate middleware
authRoutes.put('/change-role/:id', authenticate, requireRole([3]), changeUserRoleController); // Add authenticate middleware

export default authRoutes;
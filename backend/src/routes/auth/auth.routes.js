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
   logoutUserController,
   getCurrentUserController
} from '../../controllers/auth/user.controller.js';

const authRoutes = Router();

// invite route
authRoutes.post('/invite', authenticate, requireRole([2, 3]), inviteUserController);

// register route
authRoutes.post('/register', registerUserController);

// delete user route
authRoutes.delete('/:id', authenticate, deleteUserController); // Add authenticate middleware

// get current user route
authRoutes.get('/me', authenticate, getCurrentUserController); // Add authenticate middleware

// login route
authRoutes.post('/login', loginUserController);

// logout route
authRoutes.post('/logout', logoutUserController); // Add authenticate middleware

// update user route
authRoutes.put('/:id', authenticate, updateUserController); // Add authenticate middleware

// update user password route
authRoutes.patch('/password-update', authenticate, updateUserPasswordController); // Add authenticate middleware

// forgot password route
authRoutes.post('/forgot-password', forgotPasswordController);

// reset password route
authRoutes.post('/reset-password', resetPasswordController);

// get all users route
authRoutes.get('/users', authenticate, requireRole([2, 3]), getAllUsersController); // Add authenticate middleware

// change user role route
authRoutes.put('/change-role/:id', authenticate, requireRole([3]), changeUserRoleController); // Add authenticate middleware

export default authRoutes;
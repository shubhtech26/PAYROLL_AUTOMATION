import express from 'express';
import validate from '../middleware/validator.js';
import protect from '../middleware/auth.js';
import authorizeRoles from '../middleware/roleCheck.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  register,
  login,
  me,
  logout,
  changePassword,
  registerValidators,
  loginValidators,
  changePasswordValidators,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', protect, authorizeRoles('admin'), registerValidators, validate, asyncHandler(register));
router.post('/login', loginValidators, validate, asyncHandler(login));
router.get('/me', protect, asyncHandler(me));
router.post('/logout', protect, asyncHandler(logout));
router.put('/change-password', protect, changePasswordValidators, validate, asyncHandler(changePassword));

export default router;

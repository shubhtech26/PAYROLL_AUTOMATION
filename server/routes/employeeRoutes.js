import express from 'express';
import protect from '../middleware/auth.js';
import authorizeRoles from '../middleware/roleCheck.js';
import validate from '../middleware/validator.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
  createEmployeeValidators,
  updateEmployeeValidators,
} from '../controllers/employeeController.js';

const router = express.Router();

router.use(protect);
router.get('/', asyncHandler(getEmployees));
router.get('/:id/stats', asyncHandler(getEmployeeStats));
router.get('/:id', asyncHandler(getEmployeeById));
router.post('/', authorizeRoles('admin', 'manager'), createEmployeeValidators, validate, asyncHandler(createEmployee));
router.put('/:id', authorizeRoles('admin', 'manager'), updateEmployeeValidators, validate, asyncHandler(updateEmployee));
router.delete('/:id', authorizeRoles('admin'), asyncHandler(deleteEmployee));

export default router;

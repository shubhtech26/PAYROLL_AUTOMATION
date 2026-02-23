import express from 'express';
import protect from '../middleware/auth.js';
import authorizeRoles from '../middleware/roleCheck.js';
import validate from '../middleware/validator.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  getLeaves,
  getPendingLeaves,
  getLeaveById,
  createLeave,
  approveLeave,
  rejectLeave,
  deleteLeave,
  getEmployeeLeaveHistory,
  leaveValidators,
} from '../controllers/leaveController.js';

const router = express.Router();

router.use(protect);
router.get('/', asyncHandler(getLeaves));
router.get('/pending', authorizeRoles('manager', 'admin'), asyncHandler(getPendingLeaves));
router.get('/employee/:id', asyncHandler(getEmployeeLeaveHistory));
router.get('/:id', asyncHandler(getLeaveById));
router.post('/', leaveValidators, validate, asyncHandler(createLeave));
router.put('/:id/approve', authorizeRoles('manager', 'admin'), asyncHandler(approveLeave));
router.put('/:id/reject', authorizeRoles('manager', 'admin'), asyncHandler(rejectLeave));
router.delete('/:id', asyncHandler(deleteLeave));

export default router;

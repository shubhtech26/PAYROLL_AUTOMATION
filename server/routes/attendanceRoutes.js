import express from 'express';
import protect from '../middleware/auth.js';
import authorizeRoles from '../middleware/roleCheck.js';
import validate from '../middleware/validator.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  getAttendance,
  getTodayAttendance,
  getAttendanceById,
  markAttendance,
  updateAttendance,
  deleteAttendance,
  exportAttendance,
  attendanceValidators,
} from '../controllers/attendanceController.js';

const router = express.Router();

router.use(protect);
router.get('/', asyncHandler(getAttendance));
router.get('/today', asyncHandler(getTodayAttendance));
router.get('/export', authorizeRoles('admin', 'manager'), asyncHandler(exportAttendance));
router.get('/:id', asyncHandler(getAttendanceById));
router.post('/', authorizeRoles('admin', 'manager'), attendanceValidators, validate, asyncHandler(markAttendance));
router.put('/:id', authorizeRoles('admin', 'manager'), asyncHandler(updateAttendance));
router.delete('/:id', authorizeRoles('admin'), asyncHandler(deleteAttendance));

export default router;

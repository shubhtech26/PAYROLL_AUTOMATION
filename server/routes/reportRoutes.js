import express from 'express';
import protect from '../middleware/auth.js';
import authorizeRoles from '../middleware/roleCheck.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  getAttendanceReport,
  getLeaveReport,
  getDashboardStats,
  exportReport,
} from '../controllers/reportController.js';

const router = express.Router();

router.use(protect);
router.get('/attendance', authorizeRoles('admin', 'manager'), asyncHandler(getAttendanceReport));
router.get('/leave', authorizeRoles('admin', 'manager'), asyncHandler(getLeaveReport));
router.get('/dashboard', asyncHandler(getDashboardStats));
router.post('/export', authorizeRoles('admin', 'manager'), asyncHandler(exportReport));

export default router;

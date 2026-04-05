
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { deleteStudent, deleteUnverifiedUsers, getAdminReturnRequests, getAllStudents, getDashboardStats, updateStudentStatus } from '../controllers/adminController.js';

const router = express.Router();

// Path: /api/issues/admin/dashboard-stats
router.get('/admin/dashboard-stats', authMiddleware, roleMiddleware('admin'), getDashboardStats);
// Student Management
router.get('/admin/all-students', getAllStudents);

router.put('/admin/update-status/:id', updateStudentStatus);

router.delete('/student/:id', deleteStudent);
 //     /api/provide/by student



//  Sabhi pending return requests dekhne ke liye (Admin Dashboard)
router.get("/admin/returns/pending",authMiddleware,roleMiddleware('admin'),getAdminReturnRequests)
// delete user -accountverified-false
router.delete("/admin/delete-unverified",authMiddleware,roleMiddleware('admin'), deleteUnverifiedUsers);


export default router;
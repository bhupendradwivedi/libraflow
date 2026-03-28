
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { deleteStudent, getAdminReturnRequests, getAllStudents, getDashboardStats, getMyApprovedBookRequests, updateStudentStatus } from '../controllers/adminController.js';

const router = express.Router();

// Path: /api/issues/admin/dashboard-stats
router.get('/admin/dashboard-stats', authMiddleware, roleMiddleware('admin'), getDashboardStats);
// Student Management
router.get('/admin/all-students', getAllStudents);

router.put('/admin/update-status/:id', updateStudentStatus);

router.delete('/student/:id', deleteStudent);
 //     /api/provide/by student

router.get("/my-requests" ,authMiddleware,getMyApprovedBookRequests)

//  Sabhi pending return requests dekhne ke liye (Admin Dashboard)
router.get("/admin/returns/pending",authMiddleware,roleMiddleware('admin'),getAdminReturnRequests)


export default router;
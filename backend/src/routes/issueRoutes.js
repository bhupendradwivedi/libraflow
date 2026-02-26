import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { 
    recordIssueBooks, 
    getPendingRequests, 
    approveBookRequest, 
    rejectBookRequest,
    requestReturnBook,      
    approveReturnRequest    
} from '../controllers/issueController.js';

const router = express.Router();

// ================= STUDENT ROUTES =================

// 1. Book Issue ki request bhejta hai student
router.post('/book/request/:id', authMiddleware, recordIssueBooks);

// 2. Book Return karne ki request bhejta hai student
router.put('/book/return-request/:id', authMiddleware, requestReturnBook);


// ================= ADMIN ROUTES =================

// 3. Pending Issue Requests dekhna (The Queue)
router.get('/admin/requests', authMiddleware, roleMiddleware('admin'), getPendingRequests);

// 4. Issue Request ko Approve karna
router.put('/admin/request/approve/:requestId', authMiddleware, roleMiddleware('admin'), approveBookRequest);

// 5. Issue Request ko Reject karna
router.put('/admin/request/reject/:requestId', authMiddleware, roleMiddleware('admin'), rejectBookRequest);

// 6. Student ki Return Request ko final approve karna (Jab book mil jaye)
router.put('/admin/return/approve/:id', authMiddleware, roleMiddleware('admin'), approveReturnRequest);


export default router;
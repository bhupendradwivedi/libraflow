import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { 
    recordIssueBooks, 
    approveBookRequest, 
    rejectBookRequest,
    requestReturnBook,      
    approveReturnRequest,    
    getAllPendingRequestsAdmin,
    getPendingRequests,
    getMyApprovedBookRequests
} from '../controllers/issueController.js';



const router = express.Router();

//  STUDENT ROUTES 

// 1. Book Issue ki request bhejta hai student
router.post('/book/request/:id', authMiddleware, recordIssueBooks);

// 2. Book Return karne ki request bhejta hai student
router.put('/book/return-request/:id', authMiddleware, requestReturnBook);


// 3. Student apni sari requests (Pending/Approved) dekh sake
router.get('/my-requests', authMiddleware,getPendingRequests);

//

router.get("/my-approvedBook-requests" ,authMiddleware,getMyApprovedBookRequests)

// ADMIN ROUTES 

// 4. Pending Issue Requests dekhna (The Queue)
router.get('/admin/requests', authMiddleware, roleMiddleware('admin'),getAllPendingRequestsAdmin );

// 5. Issue Request ko Approve karna
router.put('/admin/request/approve/:requestId', authMiddleware, roleMiddleware('admin'), approveBookRequest);

// 6. Issue Request ko Reject karna
router.put('/admin/request/reject/:requestId', authMiddleware, roleMiddleware('admin'), rejectBookRequest);

// 7. Student ki Return Request ko final approve karna (Jab book mil jaye)
router.put('/admin/return/approve/:id', authMiddleware, roleMiddleware('admin'), approveReturnRequest);


export default router;
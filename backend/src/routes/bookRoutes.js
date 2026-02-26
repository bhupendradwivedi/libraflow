import express  from 'express';
import {authMiddleware } from '../middlewares/authMiddleware.js'
import { addBook, deleteBook, getAllBooks } from '../controllers/bookController.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';




const router = express.Router();

router.post('/admin/add', authMiddleware,roleMiddleware('admin') ,addBook);
router.get('/all', authMiddleware, getAllBooks);
router.delete('/delete/:id', authMiddleware,roleMiddleware('admin'), deleteBook);






export default router;





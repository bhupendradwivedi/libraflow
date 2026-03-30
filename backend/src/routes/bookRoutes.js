import express  from 'express';
import {authMiddleware } from '../middlewares/authMiddleware.js'
import { addBook, deleteBook, editBook, getAllBooks } from '../controllers/bookController.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { upload } from '../middlewares/upload.js';





const router = express.Router();

router.post(
  '/admin/add', 
  authMiddleware, 
  roleMiddleware('admin'), 
  upload.single('image'), 
  addBook
);

router.put('/admin/edit/:id', authMiddleware, roleMiddleware('admin'),upload.single('image'), editBook);

router.get('/all', authMiddleware, getAllBooks);

router.delete('/admin/delete/:id', authMiddleware,roleMiddleware('admin'), deleteBook);






export default router;





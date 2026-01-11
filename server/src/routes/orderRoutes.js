
import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { addOrderItems, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;

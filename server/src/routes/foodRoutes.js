
import express from 'express';
const router = express.Router();

// Mock implementation for academic demonstration
router.get('/', (req, res) => {
    res.json([
        { _id: '1', name: 'Classic Cheeseburger', price: 5.99, category: 'Burgers' },
        { _id: '2', name: 'Pepperoni Pizza', price: 12.50, category: 'Pizza' }
    ]);
});

export default router;

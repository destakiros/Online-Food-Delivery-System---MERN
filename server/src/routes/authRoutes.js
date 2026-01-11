
import express from 'express';
const router = express.Router();

router.post('/login', (req, res) => {
    // Standardized mock login
    const { email } = req.body;
    res.json({
        _id: 'mockId',
        name: 'Verified Portal User',
        email,
        isAdmin: email.includes('admin'),
        token: 'mock-jwt-token'
    });
});

export default router;

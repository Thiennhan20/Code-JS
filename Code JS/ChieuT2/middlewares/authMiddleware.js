const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// 📌 Middleware xác thực người dùng
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Không có token, quyền truy cập bị từ chối' });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin user vào request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

// 📌 Middleware kiểm tra quyền Admin
const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        // Kiểm tra role của user dựa trên ObjectId
        const user = await User.findById(req.user.id).populate('role');
        if (!user || user.role.name !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { authMiddleware, adminMiddleware };

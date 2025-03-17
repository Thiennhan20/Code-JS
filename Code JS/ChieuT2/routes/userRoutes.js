const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// 📌 Create User
router.post('/', async (req, res) => {
    try {
        const { username, password, email, fullName, avatarUrl, role } = req.body;

        if (!username || !password || !email || !role) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(400).json({ message: "Username hoặc Email đã tồn tại" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = await Role.findOne({ name: role });
        if (!userRole) return res.status(400).json({ message: "Vai trò không hợp lệ" });

        const user = new User({
            username, password: hashedPassword, email, fullName, avatarUrl, role: userRole._id
        });

        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Get All Users (Tìm theo username, fullName, loginCount)
// 📌 Get All Users (Tìm theo username, fullName, loginCount)
router.get('/', async (req, res) => {
    try {
        const { username, fullName, minLogin, maxLogin } = req.query;
        let query = { isDeleted: false };

        if (username) query.username = { $regex: username, $options: 'i' };
        if (fullName) query.fullName = { $regex: fullName, $options: 'i' };

        // 📌 Thêm lọc loginCount
        if (minLogin || maxLogin) {
            query.loginCount = {};
            if (minLogin) query.loginCount.$gte = parseInt(minLogin);
            if (maxLogin) query.loginCount.$lte = parseInt(maxLogin);
        }

        const users = await User.find(query).populate('role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// 📌 Get User by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('role');
        if (!user || user.isDeleted) return res.status(404).json({ message: "User không tồn tại" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Get User by Username
router.get('/username/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username, isDeleted: false }).populate('role');
        if (!user) return res.status(404).json({ message: "User không tồn tại" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Update User
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('role');
        if (!updatedUser) return res.status(404).json({ message: "User không tồn tại" });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Soft Delete User (Xoá mềm)
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!user) return res.status(404).json({ message: "User không tồn tại" });

        res.json({ message: "User đã bị xoá mềm" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Update status to true when username & email match
router.post('/verify', async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findOne({ username, email });

        if (!user) return res.status(404).json({ message: "Thông tin không hợp lệ" });

        user.status = true;
        await user.save();

        res.json({ message: "User đã được kích hoạt", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 API chỉ dành cho Admin (Lấy danh sách Users)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }).populate('role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Get User by ID (Bất kỳ user nào có token đều có thể xem thông tin của mình)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.id !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        const user = await User.findById(req.params.id).populate('role');
        if (!user || user.isDeleted) return res.status(404).json({ message: "User không tồn tại" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 API Xóa User (Chỉ admin được quyền)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!user) return res.status(404).json({ message: "User không tồn tại" });

        res.json({ message: "User đã bị xoá mềm" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 API dành cho Admin
router.get('/admin/protected', authMiddleware, adminMiddleware, (req, res) => {
    res.json({ message: "Chào mừng Admin!" });
});

module.exports = router;

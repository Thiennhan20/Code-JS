const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');


const router = express.Router();

// 📌 API chỉ dành cho Admin
router.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
    res.json({ message: "Chào mừng Admin!" });
});

// 📌 Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 📌 Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Tài khoản không tồn tại' });

        // 📌 Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

        // 📌 Tăng `loginCount` mỗi lần đăng nhập thành công
        user.loginCount += 1;
        await user.save();

        // 📌 Tạo JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                loginCount: user.loginCount // 📌 Trả về số lần đăng nhập
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/resetPassword/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User không tồn tại" });

        user.password = await bcrypt.hash("123456", 10);
        await user.save();

        res.json({ message: "Mật khẩu đã được reset về 123456" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/changePassword', authMiddleware, async (req, res) => {
    try {
        const { password, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User không tồn tại" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Mật khẩu đã được thay đổi thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;

const express = require('express');
const Role = require('../models/Role');

const router = express.Router();

// 📌 Create Role
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: "Tên vai trò là bắt buộc" });

        const existingRole = await Role.findOne({ name });
        if (existingRole) return res.status(400).json({ message: "Vai trò đã tồn tại" });

        const role = new Role({ name, description });
        await role.save();

        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Get All Roles
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

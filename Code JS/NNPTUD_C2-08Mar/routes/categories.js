const { fail } = require('assert');
let BuildQueies = require('../Utils/BuildQuery')
var express = require('express');
var router = express.Router();
let Category = require('../models/categories');

// Lấy tất cả danh mục
router.get('/', async (req, res) => {
    try {
        let categories = await Category.find();
        res.status(200).send({ success: true, data: categories });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// Lấy danh mục theo ID
router.get('/:id', async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);
        if (!category) return res.status(404).send({ success: false, message: "Category not found" });
        res.status(200).send({ success: true, data: category });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// Thêm danh mục mới
router.post('/', async (req, res) => {
    try {
        let newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).send({ success: true, data: newCategory });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

// Cập nhật danh mục
router.put('/:id', async (req, res) => {
    try {
        let updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send({ success: true, data: updatedCategory });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

// Xóa danh mục
router.delete('/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).send({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

module.exports = router;

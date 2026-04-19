const Category = require('../models/Category.model');

// @desc  Get all categories
// @route GET /api/categories
// @access Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, count: categories.length, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Create a category
// @route POST /api/categories
// @access Private (Admin)
const createCategory = async (req, res) => {
  try {
    const { id, label, icon } = req.body;
    
    // Check if category already exists
    const existing = await Category.findOne({ id: id.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category ID already exists' });
    }

    const category = await Category.create({
      id: id.toLowerCase(),
      label,
      icon: icon || 'fa-box',
    });

    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete a category
// @route DELETE /api/categories/:id
// @access Private (Admin)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ id: req.params.id });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCategories, createCategory, deleteCategory };

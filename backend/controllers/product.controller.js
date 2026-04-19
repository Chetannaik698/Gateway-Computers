const Product = require('../models/Product.model');

// @desc  Get all products (with optional search & category filter)
// @route GET /api/products
// @access Public
const getAllProducts = async (req, res) => {
  try {
    const { search, category, available } = req.query;
    const filter = {};

    if (category)  filter.category    = category;
    if (available) filter.isAvailable = available === 'true';
    if (search)    filter.name        = { $regex: search, $options: 'i' };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single product
// @route GET /api/products/:id
// @access Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get products by category
// @route GET /api/products/category/:cat
// @access Public
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.cat });
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Create product
// @route POST /api/products
// @access Private (Admin)
const createProduct = async (req, res) => {
  try {
    const { name, description, originalPrice, price, category, specs, badge, stock } = req.body;

    // Handle uploaded image URLs from Cloudinary
    const images = req.files ? req.files.map(f => f.path) : [];

    const product = await Product.create({
      name, description, originalPrice, price, category,
      specs: specs ? JSON.parse(specs) : [],
      badge, stock, images,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update product
// @route PUT /api/products/:id
// @access Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // If new images are uploaded, use Cloudinary URLs
    if (req.files?.length) {
      updates.images = req.files.map(f => f.path);
    }
    
    if (updates.specs) updates.specs = JSON.parse(updates.specs);

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true,
    });
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete product
// @route DELETE /api/products/:id
// @access Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllProducts, getProductById, getProductsByCategory, createProduct, updateProduct, deleteProduct };

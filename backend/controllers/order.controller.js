const Order = require('../models/Order.model');
const Product = require('../models/Product.model');

exports.createOrder = async (req, res) => {
  try {
    const {
      product: productId,
      customerName,
      customerAddress,
      quantity,
      paymentStatus
    } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const productPrice = product.price;
    const deliveryCharge = product.size === 'large' ? 200 : 150;
    const totalAmount = (productPrice * quantity) + deliveryCharge;

    const order = await Order.create({
      product: productId,
      customerName,
      customerAddress,
      quantity,
      productPrice,
      deliveryCharge,
      totalAmount,
      paymentStatus: paymentStatus || 'pending'
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('product', 'name images').sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

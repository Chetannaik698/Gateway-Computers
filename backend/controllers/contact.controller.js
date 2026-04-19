const Contact = require('../models/Contact.model');

// @desc  Submit contact/enquiry (public)
// @route POST /api/contacts
// @access Public
const submitContact = async (req, res) => {
  try {
    const { name, phone, message, product, productName, type } = req.body;
    const contact = await Contact.create({ name, phone, message, product, productName, type });
    res.status(201).json({ success: true, message: 'Message received! We will get back to you.', contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all contacts
// @route GET /api/contacts
// @access Private (Admin)
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate('product', 'name price')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Mark contact as read / replied
// @route PUT /api/contacts/:id
// @access Private (Admin)
const markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete contact
// @route DELETE /api/contacts/:id
// @access Private (Admin)
const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { submitContact, getAllContacts, markAsRead, deleteContact };

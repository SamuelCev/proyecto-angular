const SupplierModel = require('../models/supplierModel');

exports.getAll = async (req, res) => {
  try {
    const data = await SupplierModel.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await SupplierModel.getById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await SupplierModel.create(req.body);
    res.status(201).json({ id, ...req.body });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const affected = await SupplierModel.update(req.params.id, req.body);
    if (!affected) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const affected = await SupplierModel.delete(req.params.id);
    if (!affected) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

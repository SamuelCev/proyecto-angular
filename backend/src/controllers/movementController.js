const MovementModel = require('../models/movementModel');

exports.getAll = async (req, res) => {
  try {
    const data = await MovementModel.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await MovementModel.getById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByProductId = async (req, res) => {
  try {
    const data = await MovementModel.getByProductId(req.params.productId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await MovementModel.create(req.body);
    res.status(201).json({ id, ...req.body });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res) => {
  try {
    const data = await UserModel.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await UserModel.getById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let password_hash = req.body.password_hash;
    
    // Si viene la contraseña sin hashear, encryptarla
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    const id = await UserModel.create({ name, email, password_hash, role });
    res.status(201).json({ id, name, email, role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const affected = await UserModel.update(req.params.id, req.body);
    if (!affected) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const affected = await UserModel.delete(req.params.id);
    if (!affected) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const setAuthCookie = (res, user) => {
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '1d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await UserModel.getByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const id = await UserModel.create({ name, email, password_hash, role });
    const user = { id, name, role: role || 'EMPLOYEE' };

    // Inicia sesión automáticamente al registrarse.
    setAuthCookie(res, user);

    res.status(201).json({ message: 'Registro exitoso', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find user by email
    const user = await UserModel.getByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 2. Validate password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 3. Send JWT through HttpOnly Cookie
    setAuthCookie(res, user);

    res.json({ message: 'Login exitoso', user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout exitoso' });
};

exports.getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'No autenticado' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await UserModel.getById(decoded.id);
    
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

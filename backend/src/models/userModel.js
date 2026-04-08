const db = require('../config/db');

class UserModel {
  static async getAll() {
    const [rows] = await db.query('SELECT id, name, email, role, created_at, updated_at FROM users');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(userData) {
    const { name, email, password_hash, role } = userData;
    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, password_hash, role || 'EMPLOYEE']
    );
    return result.insertId;
  }

  static async update(id, userData) {
    const { name, email, role } = userData;
    const [result] = await db.query(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name, email, role, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = UserModel;

const db = require('../config/db');

class SupplierModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM suppliers');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM suppliers WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(supplierData) {
    const { name, email, phone, address } = supplierData;
    const [result] = await db.query(
      'INSERT INTO suppliers (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [name, email, phone, address]
    );
    return result.insertId;
  }

  static async update(id, supplierData) {
    const { name, email, phone, address } = supplierData;
    const [result] = await db.query(
      'UPDATE suppliers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
      [name, email, phone, address, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM suppliers WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = SupplierModel;

const db = require('../config/db');

class ProductModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM products');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(productData) {
    const { name, sku, description, price, stock, supplier_id } = productData;
    const [result] = await db.query(
      'INSERT INTO products (name, sku, description, price, stock, supplier_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, sku, description, price, stock, supplier_id]
    );
    return result.insertId;
  }

  static async update(id, productData) {
    const { name, sku, description, price, stock, supplier_id } = productData;
    const [result] = await db.query(
      'UPDATE products SET name = ?, sku = ?, description = ?, price = ?, stock = ?, supplier_id = ? WHERE id = ?',
      [name, sku, description, price, stock, supplier_id, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = ProductModel;

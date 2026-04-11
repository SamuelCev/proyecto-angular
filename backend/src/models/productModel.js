const db = require('../config/db');

class ProductModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM products WHERE is_active = TRUE');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ? AND is_active = TRUE', [id]);
    return rows[0];
  }

  static async create(productData, userId) {
    const { name, sku, description, price, stock, supplier_id } = productData;
    
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        'INSERT INTO products (name, sku, description, price, stock, supplier_id, is_active) VALUES (?, ?, ?, ?, ?, ?, TRUE)',
        [name, sku, description, price, stock, supplier_id]
      );
      const productId = result.insertId;

      if (stock > 0) {
        await connection.query(
          'INSERT INTO movements (product_id, user_id, movement_type, quantity, notes) VALUES (?, ?, ?, ?, ?)',
          [productId, userId, 'IN', stock, 'Stock inicial al registrar producto']
        );
      }

      await connection.commit();
      return productId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async update(id, productData, userId) {
    const { name, sku, description, price, stock, supplier_id } = productData;
    
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      const [rows] = await connection.query('SELECT stock FROM products WHERE id = ? AND is_active = TRUE', [id]);
      if (rows.length === 0) {
        throw new Error('Producto inactivo o no encontrado');
      }
      const oldStock = rows[0].stock;
      
      const [result] = await connection.query(
        'UPDATE products SET name = ?, sku = ?, description = ?, price = ?, stock = ?, supplier_id = ? WHERE id = ?',
        [name, sku, description, price, stock, supplier_id, id]
      );
      
      const diff = stock - oldStock;
      if (diff > 0) {
        await connection.query(
          'INSERT INTO movements (product_id, user_id, movement_type, quantity, notes) VALUES (?, ?, ?, ?, ?)',
          [id, userId, 'IN', diff, 'Ajuste manual: incremento de stock']
        );
      } else if (diff < 0) {
        await connection.query(
          'INSERT INTO movements (product_id, user_id, movement_type, quantity, notes) VALUES (?, ?, ?, ?, ?)',
          [id, userId, 'OUT', Math.abs(diff), 'Ajuste manual: reducción de stock']
        );
      }

      await connection.commit();
      return result.affectedRows;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async delete(id, userId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      const [rows] = await connection.query('SELECT stock FROM products WHERE id = ? AND is_active = TRUE', [id]);
      if (rows.length === 0) {
        throw new Error('Producto inactivo o no encontrado');
      }
      const stock = rows[0].stock;

      const [result] = await connection.query('UPDATE products SET is_active = FALSE, stock = 0 WHERE id = ?', [id]);
      
      if (stock > 0) {
        await connection.query(
          'INSERT INTO movements (product_id, user_id, movement_type, quantity, notes) VALUES (?, ?, ?, ?, ?)',
          [id, userId, 'OUT', stock, 'Vaciado de stock por baja de producto']
        );
      }

      await connection.commit();
      return result.affectedRows;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = ProductModel;

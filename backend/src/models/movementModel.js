const db = require('../config/db');

class MovementModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM movements ORDER BY created_at DESC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM movements WHERE id = ?', [id]);
    return rows[0];
  }

  static async getByProductId(productId) {
    const [rows] = await db.query('SELECT * FROM movements WHERE product_id = ? ORDER BY created_at DESC', [productId]);
    return rows;
  }

  static async create(movementData) {
    // Transacción: Registrar el movimiento y automáticamente actualizar el inventario del producto
    const { product_id, user_id, movement_type, quantity, notes } = movementData;
    
    // Obtener conexión directamente del pool para manejar la transacción
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // 1. Insertar el histórico de movimientos
      const [result] = await connection.query(
        'INSERT INTO movements (product_id, user_id, movement_type, quantity, notes) VALUES (?, ?, ?, ?, ?)',
        [product_id, user_id, movement_type, quantity, notes]
      );
      
      // 2. Modificar el stock del producto
      const stockChange = movement_type === 'IN' ? quantity : -quantity;
      await connection.query(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [stockChange, product_id]
      );

      // Confirmar todos los cambios
      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = MovementModel;

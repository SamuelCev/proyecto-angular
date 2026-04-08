const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(1, "La contraseña es requerida")
});

const registerUserSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().email("Correo electrónico inválido").max(150),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(['ADMIN', 'EMPLOYEE']).optional()
});

const updateUserSchema = registerUserSchema.partial();

const productSchema = z.object({
  name: z.string().min(2).max(150),
  sku: z.string().min(2).max(100),
  description: z.string().optional(),
  price: z.number().min(0, "El precio no puede ser negativo"),
  stock: z.number().int().min(0, "El stock inicial no puede ser negativo"),
  supplier_id: z.number().int().positive()
});

const updateProductSchema = productSchema.partial();

const supplierSchema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(50).optional().or(z.literal('')),
  address: z.string().optional()
});

const updateSupplierSchema = supplierSchema.partial();

const movementSchema = z.object({
  product_id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  movement_type: z.enum(['IN', 'OUT']),
  quantity: z.number().int().positive("La cantidad debe ser mayor a cero"),
  notes: z.string().optional()
});

module.exports = {
  loginSchema,
  registerUserSchema,
  updateUserSchema,
  productSchema,
  updateProductSchema,
  supplierSchema,
  updateSupplierSchema,
  movementSchema
};

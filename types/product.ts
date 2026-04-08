export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  price: number;
  stock: number;
  supplier_id: number;
  created_at?: Date;
  updated_at?: Date;
}

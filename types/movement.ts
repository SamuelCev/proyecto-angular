export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
}

export interface Movement {
  id: number;
  product_id: number;
  user_id: number;
  movement_type: MovementType;
  quantity: number;
  notes?: string;
  created_at?: Date;
}

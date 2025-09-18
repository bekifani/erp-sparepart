export interface Product {
  id: number;
  product_name_id?: number;
  product_code: string;
  brand: string;
  brand_code: string;
  oe_code: string;
  description: string;
  net_weight: number;
  gross_weight: number;
  unit_id: string;
  box_id?: number;
  product_size_a?: number;
  product_size_b?: number;
  product_size_c?: number;
  volume?: number;
  label_id?: number;
  qr_code?: string;
  properties?: string;
  technical_image?: string;
  image?: string;
  size_mode?: string;
  additional_note?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  dateAdded: Date;
  customerNote?: string;
  customPrice?: number;
}

export interface Cart {
  id: string;
  customer: string;
  items: CartItem[];
  totalWeight: number;
  totalVolume: number;
  totalAmount: number;
  lastEditDate: Date;
  firstEditDate: Date;
  additionalNote?: string;
  status: 'active' | 'confirmed' | 'archived';
}

export interface CartSummary {
  customer: string;
  productCount: number;
  totalQuantity: number;
  totalWeight: number;
  totalVolume: number;
  totalAmount: number;
  lastEditDate: Date;
  firstEditDate: Date;
  additionalNote?: string;
  status: 'active' | 'confirmed' | 'archived';
}
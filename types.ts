
export interface Product {
  id: number;
  name: string;
  minOrder: string;
  minOrderQuantity: number;
  price: number;
  type: 'Local' | 'Import';
  originalPrice?: number;
  promotion?: string;
  basePrice?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Employee {
  name: string;
  code: string;
}

export interface Customer {
  code: string;
  name: string;
}

export interface Order {
  id: string;
  customerCode: string;
  customerName: string;
  note: string;
  items: CartItem[];
  isNewCustomer: boolean;
  createdAt: number;
  status: 'draft' | 'sent';
  totalAmount: number;
  finalAmount: number;
  totalSales: number;
}

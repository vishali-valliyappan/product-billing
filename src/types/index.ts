export interface Product {
  id: number;
  name: string;
  price: number; // in £
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Offer {
  id: number;
  description: string;
  productId: number; // product this offer applies to
  saving: number;
}

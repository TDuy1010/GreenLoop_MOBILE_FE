export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sustainability: number; // Điểm xanh (1-5)
  inStock: boolean;
  condition?: 'new' | 'like-new' | 'good' | 'fair';
}

export type ProductCategory = 
  | 'clothing' 
  | 'accessories' 
  | 'shoes' 
  | 'bags' 
  | 'all';
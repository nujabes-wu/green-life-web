export interface MallItem {
  id: string;
  title: string;
  description: string;
  points_cost: number;
  image_url: string;
  stock: number;
  category?: string;
  created_at?: string;
}

export interface MarketItem {
  id: string;
  title: string;
  description: string;
  price_cny: number;
  image_url: string;
  contact_info: string;
  seller_id: string;
  status: 'active' | 'sold';
  created_at: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  avatar_url?: string;
  credits: number;
  updated_at?: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'earn' | 'redeem';
  description: string;
  created_at: string;
}

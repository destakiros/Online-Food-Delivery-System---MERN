
export interface SizeOption {
  name: string;
  priceOffset: number;
}

export interface Modifier {
  name: string;
  priceOffset: number;
}

export interface Food {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  ingredients: string[];
  calories?: number;
  spicyLevel: 'None' | 'Mild' | 'Medium' | 'Hot';
  sizeOptions: SizeOption[];
  hasCookingPreference?: boolean;
  availableToppings: Modifier[];
  availableSauces: string[];
  isAvailable: boolean;
}

export interface SystemMessage {
  id: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  type: 'status' | 'alert' | 'general';
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  phone?: string;
  status: 'Active' | 'Suspended';
  notifications: SystemMessage[];
}

export interface ConfiguredItem {
  foodId: string;
  name: string;
  price: number;
  qty: number;
  imageUrl?: string;
  selectedSize: string;
  selectedToppings: string[];
  selectedSauce: string;
  modifiers: { [key: string]: 'Add' | 'Remove' | 'Extra' | 'Standard' | 'No Salt' | 'No Spice' };
  cookingPreference?: 'Rare' | 'Medium' | 'Well-done';
  notes?: string;
  _hash?: string;
}

export interface OrderItem {
  food: string;
  name: string;
  qty: number;
  price: number;
  config?: any;
}

export interface Order {
  _id: string;
  user: any; 
  orderItems: OrderItem[];
  totalPrice: number;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentMethod?: string;
  bankName?: string;
  accountNumber?: string;
  paymentReceipt?: string;
  destination?: string;
  extraMessage?: string;
  deliveryFee?: number;
  createdAt: string;
  history?: { status: string; time: string }[];
  rating?: number;
  reviewComment?: string;
  adminFeedback?: 'Helpful' | 'Not Helpful' | null;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type UserRole = 'ADMIN' | 'FOURNISSEUR' | 'CLIENT_PRO';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'REFUSED' | 'SUSPENDED';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  companyName?: string;
  phone?: string;
  address?: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

export interface BackendProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  fournisseurId: string;
  fournisseurName: string;
  category: string;
  type?: string;
  characteristics?: Record<string, unknown>;
  stockQuantity: number;
  status: 'ACTIVE' | 'DISABLED' | 'OUT_OF_STOCK';
}

export interface CartProductRef {
  _id: string;
  name: string;
  slug?: string;
  price?: number;
  image?: string;
  fournisseurName?: string;
  category?: string;
  type?: string;
  stockQuantity?: number;
  status?: 'ACTIVE' | 'DISABLED' | 'OUT_OF_STOCK';
}

export interface CartItem {
  productId: string | CartProductRef;
  fournisseurId: string;
  quantity: number;
  unitPrice: number;
}

export interface ClientCart {
  _id: string;
  clientProId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface OrderItem {
  productId: string;
  fournisseurId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CheckoutInfo {
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

export interface SupplierOrder {
  _id: string;
  clientProId: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentInfo?: {
    method?: string;
    status?: string;
    transactionReference?: string;
    date?: string;
  };
  checkoutInfo?: CheckoutInfo;
  createdAt: string;
  updatedAt: string;
}

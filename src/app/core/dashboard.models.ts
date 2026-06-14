import { AuthUser, BackendProduct, OrderStatus, PaymentStatus, SupplierOrder, UserRole, UserStatus } from './api.models';

export interface DashboardStat {
  label: string;
  value: string | number;
  helper?: string;
  tone?: 'dark' | 'gold' | 'blue' | 'amber' | 'red' | 'gray';
  icon?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  percent?: number;
  helper?: string;
}

export interface RevenuePoint {
  label: string;
  value: number;
}

export interface TopProduct {
  productId?: string;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface ProductStockAlert {
  _id: string;
  name: string;
  category: string;
  stockQuantity: number;
  fournisseurName?: string;
  status: BackendProduct['status'];
}

export interface UserSummary extends AuthUser {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AccountRequest {
  _id: string;
  name: string;
  email: string;
  requestedRole: Extract<UserRole, 'FOURNISSEUR' | 'CLIENT_PRO'>;
  companyName?: string;
  phone?: string;
  address?: string;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REFUSED';
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalClients: number;
  totalFournisseurs: number;
  pendingAccountRequests: number;
  totalProducts: number;
  totalOrders: number;
  lowStockCount: number;
  revenue: {
    revenue: number;
    averageOrderValue: number;
    paidOrders: number;
  };
  usersByRole: ChartDataPoint[];
  requestsByStatus: ChartDataPoint[];
  productsByCategory: ChartDataPoint[];
  ordersByStatus: ChartDataPoint[];
  revenueByMonth: RevenuePoint[];
  topProducts: TopProduct[];
  lowStockProducts: ProductStockAlert[];
  recentOrders: SupplierOrder[];
  recentUsers: UserSummary[];
  pendingRequests: AccountRequest[];
}

export interface AdminDashboardData {
  analytics: AdminAnalytics;
  users: UserSummary[];
  requests: AccountRequest[];
  products: BackendProduct[];
  orders: SupplierOrder[];
}

export interface DashboardTableColumn {
  key: string;
  label: string;
  kind?: 'text' | 'money' | 'date' | 'status' | 'number';
}

export interface FilterState {
  search: string;
  status: string;
  date: string;
}

export interface UserStatusUpdate {
  status: UserStatus;
}

export type DashboardOrderStatus = OrderStatus;
export type DashboardPaymentStatus = PaymentStatus;

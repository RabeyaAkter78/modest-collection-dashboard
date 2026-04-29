export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  avatar?: string;
  isBlocked: boolean;
  createdAt: string;
  phone?: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: "Borkha" | "Abaya" | "Hijab" | "Innercap" | "Accessories";
  images: string[];
  stock: number;
  description: string;
  status: "active" | "draft" | "archived";
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  shippingAddress: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface EarningsData {
  date: string;
  revenue: number;
  orders: number;
}

export interface CMSContent {
  id: string;
  type: "privacy_policy" | "terms_conditions" | "contact_info";
  title: string;
  content: string;
  updatedAt: string;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

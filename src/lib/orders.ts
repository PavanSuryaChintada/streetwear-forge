import type { CartItem } from "@/context/CartContext";

export type OrderStatus = "PLACED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type Order = {
  id: string;
  userEmail: string;
  items: { slug: string; name: string; image: string; size: string; qty: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  address: { name: string; phone: string; line1: string; city: string; state: string; pincode: string };
  paymentId: string;
  createdAt: number;
};

const KEY = "sd_orders";

const read = (): Order[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};
const write = (orders: Order[]) => {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(orders));
};

export const listOrders = read;
export const ordersFor = (email: string) => read().filter((o) => o.userEmail === email);

export const createOrder = (params: {
  email: string;
  items: CartItem[];
  shipping: number;
  address: Order["address"];
  paymentId: string;
}): Order => {
  const subtotal = params.items.reduce((s, i) => s + i.qty * i.product.price, 0);
  const order: Order = {
    id: "SD" + Date.now().toString(36).toUpperCase(),
    userEmail: params.email,
    items: params.items.map((i) => ({
      slug: i.product.slug, name: i.product.name, image: i.product.image,
      size: i.size, qty: i.qty, price: i.product.price,
    })),
    subtotal,
    shipping: params.shipping,
    total: subtotal + params.shipping,
    status: "PLACED",
    address: params.address,
    paymentId: params.paymentId,
    createdAt: Date.now(),
  };
  write([order, ...read()]);
  return order;
};

export const updateOrderStatus = (id: string, status: OrderStatus) => {
  write(read().map((o) => (o.id === id ? { ...o, status } : o)));
};

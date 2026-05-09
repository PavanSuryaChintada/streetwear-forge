import type { CartItem } from "@/context/CartContext";

export type OrderStatus =
  | "PLACED"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type InvoiceLine = { label: string; amount: number };

export type Order = {
  id: string;
  invoiceNo: string;
  userEmail: string;
  items: { slug: string; name: string; image: string; size: string; qty: number; price: number }[];
  subtotal: number;
  shipping: number;
  taxRate: number;     // %
  tax: number;
  discount: number;
  extraLines: InvoiceLine[];
  total: number;
  status: OrderStatus;
  address: { name: string; phone: string; line1: string; city: string; state: string; pincode: string };
  paymentId: string;
  notes?: string;
  refundAmount?: number;
  refundedAt?: number;
  cancelledAt?: number;
  createdAt: number;
};

const KEY = "sd_orders";

const read = (): Order[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw: any[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    return raw.map((o) => ({
      invoiceNo: o.invoiceNo ?? "INV-" + o.id,
      taxRate: o.taxRate ?? 0,
      tax: o.tax ?? 0,
      discount: o.discount ?? 0,
      extraLines: o.extraLines ?? [],
      ...o,
    }));
  } catch { return []; }
};
const write = (orders: Order[]) => {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(orders));
};

export const listOrders = read;
export const ordersFor = (email: string) => read().filter((o) => o.userEmail === email);
export const getOrder = (id: string) => read().find((o) => o.id === id);

export const recomputeTotal = (o: Order): number => {
  const tax = Math.round((o.subtotal * (o.taxRate || 0)) / 100);
  const extras = (o.extraLines || []).reduce((s, l) => s + l.amount, 0);
  return Math.max(0, o.subtotal + o.shipping + tax + extras - (o.discount || 0));
};

export const createOrder = (params: {
  email: string;
  items: CartItem[];
  shipping: number;
  address: Order["address"];
  paymentId: string;
}): Order => {
  const subtotal = params.items.reduce((s, i) => s + i.qty * i.product.price, 0);
  const id = "SD" + Date.now().toString(36).toUpperCase();
  const order: Order = {
    id,
    invoiceNo: "INV-" + id,
    userEmail: params.email,
    items: params.items.map((i) => ({
      slug: i.product.slug, name: i.product.name, image: i.product.image,
      size: i.size, qty: i.qty, price: i.product.price,
    })),
    subtotal,
    shipping: params.shipping,
    taxRate: 0,
    tax: 0,
    discount: 0,
    extraLines: [],
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

export const cancelOrder = (id: string) => {
  write(read().map((o) => (o.id === id ? { ...o, status: "CANCELLED" as OrderStatus, cancelledAt: Date.now() } : o)));
};

export const refundOrder = (id: string, amount?: number) => {
  write(read().map((o) => {
    if (o.id !== id) return o;
    return { ...o, status: "REFUNDED" as OrderStatus, refundAmount: amount ?? o.total, refundedAt: Date.now() };
  }));
};

export const updateInvoice = (id: string, patch: Partial<Order>) => {
  write(read().map((o) => {
    if (o.id !== id) return o;
    const next = { ...o, ...patch };
    next.tax = Math.round((next.subtotal * (next.taxRate || 0)) / 100);
    next.total = recomputeTotal(next);
    return next;
  }));
};

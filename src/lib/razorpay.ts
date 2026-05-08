// Razorpay test integration (client-side checkout).
// Test Key ID is publishable and safe to ship. The secret stays server-side
// (not used here — test mode works without server-created orders).
export const RAZORPAY_KEY_ID = "rzp_test_Smq00oQl4okg6L";

let scriptPromise: Promise<boolean> | null = null;

export function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if ((window as any).Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => { scriptPromise = null; resolve(false); };
    document.body.appendChild(s);
  });
  return scriptPromise;
}

export type RzpOpts = {
  amountPaise: number;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
  notes?: Record<string, string>;
  onSuccess: (paymentId: string) => void;
  onDismiss: () => void;
};

export async function openRazorpay(opts: RzpOpts) {
  const ok = await loadRazorpay();
  if (!ok) throw new Error("Failed to load Razorpay. Check your connection.");
  const rzp = new (window as any).Razorpay({
    key: RAZORPAY_KEY_ID,
    amount: opts.amountPaise,
    currency: "INR",
    name: opts.name,
    description: opts.description,
    image: "/favicon.ico",
    prefill: opts.prefill,
    notes: opts.notes,
    theme: { color: "#ff3b1f" },
    handler: (resp: any) => opts.onSuccess(resp.razorpay_payment_id),
    modal: { ondismiss: opts.onDismiss, backdropclose: false, escape: true },
  });
  rzp.on("payment.failed", (resp: any) => {
    // surface but do not throw — checkout already closed
    console.error("Razorpay failure", resp?.error);
  });
  rzp.open();
}

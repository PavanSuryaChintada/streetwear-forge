import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { getOrder, type Order } from "@/lib/orders";
import { formatINR } from "@/context/CartContext";
import { Printer } from "lucide-react";

export const Route = createFileRoute("/invoice/$id")({
  component: InvoicePage,
  head: () => ({ meta: [{ title: "Invoice — STUDIO/DENY" }] }),
});

function InvoicePage() {
  const { id } = Route.useParams();
  const [o, setO] = useState<Order | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { setO(getOrder(id) ?? null); }, [id]);

  if (!o) return <section className="px-4 md:px-8 py-24 text-center"><h1 className="text-display text-5xl">INVOICE NOT FOUND</h1></section>;

  return (
    <section className="px-4 md:px-8 mt-8 md:mt-12 max-w-3xl mx-auto pb-16">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Link to="/order/$id" params={{ id: o.id }} className="text-mono text-[11px] tracking-widest text-muted-foreground hover:text-primary">← BACK TO ORDER</Link>
        <button onClick={() => window.print()} className="border border-border h-10 px-4 inline-flex items-center gap-2 text-mono text-xs tracking-widest hover:border-primary hover:text-primary">
          <Printer className="size-4" /> PRINT
        </button>
      </div>

      <div ref={ref} className="bg-surface border border-border p-8 md:p-12">
        <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
          <div>
            <div className="text-display text-3xl tracking-wider">STUDIO/DENY</div>
            <div className="text-mono text-[10px] text-muted-foreground tracking-widest">STREETWEAR · MUMBAI</div>
          </div>
          <div className="text-right">
            <div className="text-mono text-[10px] tracking-widest text-muted-foreground">INVOICE</div>
            <div className="text-display text-2xl">{o.invoiceNo}</div>
            <div className="text-mono text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</div>
            <div className="text-mono text-[10px] mt-1"><span className="text-muted-foreground">STATUS </span><span className="text-secondary">{o.status}</span></div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="text-mono text-[10px] tracking-widest text-muted-foreground mb-1">BILL TO</div>
            <div className="font-semibold">{o.address.name}</div>
            <div className="text-sm text-muted-foreground">{o.userEmail}</div>
            <div className="text-sm text-muted-foreground">{o.address.line1}</div>
            <div className="text-sm text-muted-foreground">{o.address.city}, {o.address.state} {o.address.pincode}</div>
            <div className="text-sm text-muted-foreground">{o.address.phone}</div>
          </div>
          <div>
            <div className="text-mono text-[10px] tracking-widest text-muted-foreground mb-1">PAYMENT</div>
            <div className="text-sm">Razorpay</div>
            <div className="text-mono text-xs text-muted-foreground break-all">{o.paymentId}</div>
            <div className="text-mono text-[10px] tracking-widest text-muted-foreground mt-3 mb-1">ORDER</div>
            <div className="text-mono text-xs">#{o.id}</div>
          </div>
        </div>

        <table className="w-full text-sm mb-6">
          <thead className="text-mono text-[10px] tracking-widest text-muted-foreground border-b border-border">
            <tr><th className="text-left py-2">ITEM</th><th className="text-left py-2">SIZE</th><th className="text-right py-2">QTY</th><th className="text-right py-2">PRICE</th><th className="text-right py-2">AMOUNT</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {o.items.map((it) => (
              <tr key={it.slug + it.size}>
                <td className="py-2">{it.name}</td>
                <td className="py-2 text-mono text-xs">{it.size}</td>
                <td className="py-2 text-right text-mono">{it.qty}</td>
                <td className="py-2 text-right text-mono">{formatINR(it.price)}</td>
                <td className="py-2 text-right text-mono">{formatINR(it.price * it.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto max-w-xs space-y-1 text-mono text-sm">
          <Row k="SUBTOTAL" v={formatINR(o.subtotal)} />
          <Row k="SHIPPING" v={o.shipping === 0 ? "FREE" : formatINR(o.shipping)} />
          {o.taxRate ? <Row k={`TAX (${o.taxRate}%)`} v={formatINR(o.tax)} /> : null}
          {o.discount ? <Row k="DISCOUNT" v={"− " + formatINR(o.discount)} /> : null}
          {o.extraLines.map((l, i) => <Row key={i} k={l.label.toUpperCase()} v={formatINR(l.amount)} />)}
          <Row k="TOTAL" v={formatINR(o.total)} bold />
          {o.refundAmount ? <Row k="REFUNDED" v={"− " + formatINR(o.refundAmount)} /> : null}
        </div>

        {o.notes && (
          <div className="mt-8 border-t border-border pt-4">
            <div className="text-mono text-[10px] tracking-widest text-muted-foreground mb-1">NOTES</div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{o.notes}</p>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-border text-center text-mono text-[10px] tracking-widest text-muted-foreground">
          THANK YOU FOR REPPING STUDIO/DENY · support@studiodeny.in
        </div>
      </div>
      <style>{`@media print{nav,header,footer,.print\\:hidden{display:none!important}body{background:white;color:black}}`}</style>
    </section>
  );
}
function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return <div className={`flex justify-between ${bold ? "text-base pt-2 border-t border-border" : "text-muted-foreground"}`}><span>{k}</span><span>{v}</span></div>;
}

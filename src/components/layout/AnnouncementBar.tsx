const messages = [
  "FREE SHIPPING ON ORDERS ABOVE ₹999",
  "NEW DROP — SHADOW REALM COLLECTION",
  "USE CODE DENY10 FOR 10% OFF",
  "MADE IN INDIA · SHIPPED WORLDWIDE",
];

export function AnnouncementBar() {
  const loop = [...messages, ...messages, ...messages, ...messages];
  return (
    <div className="bg-primary text-primary-foreground border-b border-primary/40 overflow-hidden">
      <div className="flex whitespace-nowrap marquee py-1.5 text-mono text-[11px] font-medium tracking-[0.2em] uppercase">
        {loop.map((m, i) => (
          <span key={i} className="mx-6 flex items-center gap-6">
            {m} <span className="opacity-60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const messages = [
  "FREE SHIPPING ON ORDERS ABOVE ₹999",
  "NEW DROP — SHADOW REALM COLLECTION IS LIVE",
  "USE CODE DENY10 FOR 10% OFF YOUR FIRST ORDER",
  "MADE IN INDIA · WORN WORLDWIDE · NO APOLOGIES",
  "LIMITED STOCK — GRAB IT BEFORE IT'S GONE",
];

export function AnnouncementBar() {
  const loop = [...messages, ...messages, ...messages];
  return (
    <div className="bg-primary text-primary-foreground overflow-hidden relative" style={{ height: "36px" }}>
      <div className="flex whitespace-nowrap marquee items-center h-full" style={{ width: "max-content" }}>
        {loop.map((m, i) => (
          <span key={i} className="mx-8 flex items-center gap-8 text-mono font-semibold tracking-[0.22em] uppercase" style={{ fontSize: "10px" }}>
            {m}
            <span className="opacity-50 text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

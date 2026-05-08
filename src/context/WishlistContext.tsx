import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Ctx = {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  clear: () => void;
};

const C = createContext<Ctx | null>(null);
const KEY = "sd_wish";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setSlugs(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: string[]) => {
    setSlugs(next);
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(next));
  };

  return (
    <C.Provider
      value={{
        slugs,
        has: (s) => slugs.includes(s),
        toggle: (s) => persist(slugs.includes(s) ? slugs.filter((x) => x !== s) : [...slugs, s]),
        clear: () => persist([]),
      }}
    >
      {children}
    </C.Provider>
  );
}

export const useWishlist = () => {
  const c = useContext(C);
  if (!c) throw new Error("WishlistProvider missing");
  return c;
};

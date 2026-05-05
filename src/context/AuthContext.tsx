import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = { id: string; email: string; name: string; role: "user" | "admin" };

type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "sd_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      if (u) localStorage.setItem(KEY, JSON.stringify(u));
      else localStorage.removeItem(KEY);
    }
  };

  return (
    <Ctx.Provider
      value={{
        user,
        login: async (email) => {
          await new Promise((r) => setTimeout(r, 400));
          const role: "user" | "admin" = email.toLowerCase().startsWith("admin") ? "admin" : "user";
          persist({ id: crypto.randomUUID(), email, name: email.split("@")[0], role });
        },
        signup: async (email, _pw, name) => {
          await new Promise((r) => setTimeout(r, 400));
          persist({ id: crypto.randomUUID(), email, name, role: "user" });
        },
        logout: () => persist(null),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("AuthProvider missing");
  return c;
};

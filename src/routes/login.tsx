import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Login — STUDIO/DENY" }] }),
});

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Min 6 characters"),
});
type V = z.infer<typeof schema>;

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<V>({ resolver: zodResolver(schema) });

  return (
    <section className="px-4 md:px-8 py-12 max-w-md mx-auto">
      <div className="text-mono text-[11px] tracking-[0.3em] text-primary mb-2">◢ MEMBERS</div>
      <h1 className="text-display text-6xl mb-2">LOG IN.</h1>
      <p className="text-muted-foreground text-sm mb-8">No account? <Link to="/signup" className="text-primary hover:underline">SIGN UP</Link></p>

      <form
        onSubmit={handleSubmit(async (d) => {
          setLoading(true);
          try { await login(d.email, d.password); toast.success("Welcome back"); navigate({ to: "/account" }); }
          catch { toast.error("Login failed"); }
          finally { setLoading(false); }
        })}
        className="space-y-4"
      >
        <div>
          <label className="text-mono text-[10px] tracking-widest text-muted-foreground">EMAIL</label>
          <input {...register("email")} type="email" className="mt-1 w-full bg-surface border border-border h-11 px-3 focus:border-primary outline-none" />
          {errors.email && <p className="text-xs text-primary mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-mono text-[10px] tracking-widest text-muted-foreground">PASSWORD</label>
          <input {...register("password")} type="password" className="mt-1 w-full bg-surface border border-border h-11 px-3 focus:border-primary outline-none" />
          {errors.password && <p className="text-xs text-primary mt-1">{errors.password.message}</p>}
        </div>
        <button disabled={loading} className="w-full bg-primary text-primary-foreground font-bold tracking-[0.2em] text-mono text-xs h-12 hover:glow-primary disabled:opacity-50">
          {loading ? "..." : "LOG IN"}
        </button>
        <p className="text-[10px] text-mono tracking-widest text-muted-foreground text-center">
          TIP: USE EMAIL STARTING WITH "ADMIN" FOR ADMIN ACCESS
        </p>
      </form>
    </section>
  );
}

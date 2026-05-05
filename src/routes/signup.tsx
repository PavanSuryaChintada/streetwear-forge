import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  component: Signup,
  head: () => ({ meta: [{ title: "Sign up — STUDIO/DENY" }] }),
});

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6),
});
type V = z.infer<typeof schema>;

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<V>({ resolver: zodResolver(schema) });

  return (
    <section className="px-4 md:px-8 py-12 max-w-md mx-auto">
      <div className="text-mono text-[11px] tracking-[0.3em] text-primary mb-2">◢ JOIN THE CULT</div>
      <h1 className="text-display text-6xl mb-2">SIGN UP.</h1>
      <p className="text-muted-foreground text-sm mb-8">Already with us? <Link to="/login" className="text-primary hover:underline">LOG IN</Link></p>

      <form
        onSubmit={handleSubmit(async (d) => {
          setLoading(true);
          try { await signup(d.email, d.password, d.name); toast.success("Account created"); navigate({ to: "/account" }); }
          catch { toast.error("Signup failed"); }
          finally { setLoading(false); }
        })}
        className="space-y-4"
      >
        <div>
          <label className="text-mono text-[10px] tracking-widest text-muted-foreground">NAME</label>
          <input {...register("name")} className="mt-1 w-full bg-surface border border-border h-11 px-3 focus:border-primary outline-none" />
          {errors.name && <p className="text-xs text-primary mt-1">{errors.name.message}</p>}
        </div>
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
          {loading ? "..." : "CREATE ACCOUNT"}
        </button>
      </form>
    </section>
  );
}

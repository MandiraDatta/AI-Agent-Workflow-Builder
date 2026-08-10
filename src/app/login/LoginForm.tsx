"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import { Eye, EyeOff, Boxes, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

type LoginState = "idle" | "submitting" | "success" | "error";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<LoginState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const user = auth.getCurrentUser();
    if (user) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      await auth.login(email, password);
      setStatus("success");
      router.push("/dashboard");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to sign in. Please check your credentials.");
    }
  };

  return (
    <div className="w-full max-w-[420px] bg-[#181423] border border-[#2D273F] rounded-xl p-8 shadow-2xl">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-xl flex items-center justify-center mb-4 border border-primary-500/20">
          <Boxes className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-primary-500 mb-1 tracking-wide uppercase">
          AI Agent Workflow Builder
        </p>
        <h1 className="text-2xl font-bold text-[#F5F5F5] mb-2">
          Sign in to your workspace
        </h1>
        <p className="text-zinc-400 text-sm">
          Access your organization's workflows and automation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={status === "submitting" || status === "success"}
            className="w-full bg-[#08060E] border border-[#2D273F] rounded-lg px-4 py-2.5 text-[#F5F5F5] placeholder-zinc-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors disabled:opacity-50"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
              Password
            </label>
            <Link
              href="#"
              className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
              tabIndex={-1}
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={status === "submitting" || status === "success"}
              className="w-full bg-[#08060E] border border-[#2D273F] rounded-lg pl-4 pr-11 py-2.5 text-[#F5F5F5] placeholder-zinc-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={status === "submitting" || status === "success"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none focus:text-zinc-300 disabled:opacity-50"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            disabled={status === "submitting" || status === "success"}
            className="h-4 w-4 rounded border-[#2D273F] bg-[#08060E] text-primary-500 focus:ring-primary-500 focus:ring-offset-[#181423] disabled:opacity-50"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-400">
            Remember me
          </label>
        </div>

        {status === "error" && (
          <div className="flex items-start gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting" || status === "success"}
          className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-[#181423] disabled:opacity-70 transition-colors"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-[#2D273F] text-center">
        <p className="text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link href="#" className="font-medium text-[#F5F5F5] hover:text-primary-500 transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

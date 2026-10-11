"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Field } from "@/components/Field";

export default function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isSignUp = mode === "sign-up";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setLoading(true);

    try {
      const res = await fetch(isSignUp ? "/api/register" : "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(json.error ?? "Something went wrong. Try again.");
        return;
      }

      toast.success(
        isSignUp ? "Account created. Welcome to Acadent!" : "Welcome back!"
      );
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {isSignUp && (
        <Field
          label="Full name"
          icon="user"
          name="name"
          type="text"
          autoComplete="name"
          required
        />
      )}

      <Field
        label="Email address"
        icon="mail"
        name="email"
        type="email"
        autoComplete="email"
        required
      />

      <Field
        label="Password"
        icon="lock"
        name="password"
        type="password"
        autoComplete={isSignUp ? "new-password" : "current-password"}
        minLength={isSignUp ? 8 : undefined}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-ocean px-4 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}

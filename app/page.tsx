import Link from "next/link";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-midnight p-6 text-center text-white">
      <h1 className="font-heading text-4xl">Acadent</h1>
      <p className="text-white/70">Manage. Track. Empower.</p>
      <Link
        href={session ? "/dashboard" : "/sign-in"}
        className="rounded-lg bg-ocean px-6 py-3 font-semibold text-white transition hover:opacity-90"
      >
        {session ? "Go to dashboard" : "Sign in"}
      </Link>
    </main>
  );
}

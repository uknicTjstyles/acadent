import Link from "next/link";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import AuthShell from "@/components/AuthShell";
import { getSession } from "@/lib/session";

export default async function SignInPage() {
  if (await getSession()) redirect("/dashboard");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your students."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-ocean underline">
            Sign up
          </Link>
        </>
      }
    >
      <AuthForm mode="sign-in" />
    </AuthShell>
  );
}

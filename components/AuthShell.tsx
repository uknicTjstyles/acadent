import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-midnight p-12 text-white md:flex">
        <Link href="/" aria-label="Acadent home" className="w-fit">
          <Image
            src="/brand/logo-for-dark-backgrounds.png"
            alt="Acadent"
            width={150}
            height={150}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <div>
          <p className="font-heading text-4xl leading-tight">
            Manage students.
            <br />
            Simplify administration.
          </p>
          <p className="mt-4 max-w-sm text-white/70">
            Keep student records, and every update to them, in one place.
          </p>
        </div>

        <p className="text-sm text-white/50">
          Smarter management. Better education.
        </p>
      </aside>

      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <Link href="/" aria-label="Acadent home" className="inline-block">
              <Image
                src="/brand/logo-for-light-backgrounds.png"
                alt="Acadent"
                width={590}
                height={167}
                className="h-9 w-auto"
                priority
              />
            </Link>
          </div>

          <h1 className="font-heading text-2xl font-semibold text-midnight">
            {title}
          </h1>
          <p className="mt-1 text-sm text-midnight/60">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <p className="mt-6 text-sm text-midnight/60">{footer}</p>
        </div>
      </section>
    </main>
  );
}

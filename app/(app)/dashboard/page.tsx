import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import Student from "@/models/Student";

export default async function DashboardPage() {
  const session = await getSession();
  const firstName = session?.name.split(" ")[0] ?? "there";

  await connectDB();
  const [total, active, onLeave, graduated] = await Promise.all([
    Student.countDocuments(),
    Student.countDocuments({ status: "Active" }),
    Student.countDocuments({ status: "On Leave" }),
    Student.countDocuments({ status: "Graduated" }),
  ]);

  const card = "rounded-xl border border-cloud bg-white p-5";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-midnight">
          Welcome, {firstName}
        </h1>
        <Link
          href="/students"
          className="rounded-lg bg-ocean px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          + Add Student
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className={card}>
          <p className="text-sm text-midnight/60">Total students</p>
          <p className="mt-1 font-heading text-2xl font-semibold text-midnight">
            {total}
          </p>
        </div>
        <div className={card}>
          <p className="text-sm text-midnight/60">Active</p>
          <p className="mt-1 font-heading text-2xl font-semibold text-emerald-600">
            {active}
          </p>
        </div>
        <div className={card}>
          <p className="text-sm text-midnight/60">On leave</p>
          <p className="mt-1 font-heading text-2xl font-semibold text-amber-600">
            {onLeave}
          </p>
        </div>
        <div className={card}>
          <p className="text-sm text-midnight/60">Graduated</p>
          <p className="mt-1 font-heading text-2xl font-semibold text-sky-600">
            {graduated}
          </p>
        </div>
      </div>

      <p className="mt-8 text-sm text-midnight/60">
        Head to{" "}
        <Link href="/students" className="text-ocean underline">
          Students
        </Link>{" "}
        to add, edit, or view student records.
      </p>
    </div>
  );
}

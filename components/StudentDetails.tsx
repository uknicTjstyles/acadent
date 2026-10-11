import type { Student } from "@/lib/types";

const statusStyle: Record<Student["status"], string> = {
  Active: "bg-emerald-100 text-emerald-700",
  "On Leave": "bg-amber-100 text-amber-700",
  Graduated: "bg-sky-100 text-sky-700",
};

export default function StudentDetails({
  student,
  onClose,
}: {
  student: Student;
  onClose: () => void;
}) {
  const row = (label: string, value: string | number | null | undefined) => (
    <div>
      <p className="text-xs text-midnight/50">{label}</p>
      <p className="mt-0.5 font-medium text-midnight">{value ?? "-"}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-t-2xl bg-white p-5 sm:rounded-xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-semibold text-midnight">
              {student.name}
            </h2>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle[student.status]}`}
            >
              {student.status}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-midnight/50 transition hover:text-midnight"
          >
            &times;
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {row("Student ID", student.studentId)}
          {row("Level", `${student.level} Level`)}
          {row("Department", student.department)}
          {row("Email", student.email)}
          {row("Phone", student.phone)}
          {row(
            "Added on",
            new Date(student.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          )}
        </div>
      </div>
    </div>
  );
}

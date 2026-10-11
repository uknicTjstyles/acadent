"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Field, SelectField } from "@/components/Field";
import { DEPARTMENTS, LEVELS, STATUSES } from "@/lib/departments";
import type { Student } from "@/lib/types";

export default function StudentForm({
  student,
  onClose,
  onSaved,
}: {
  student: Student | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form);
    setSaving(true);

    try {
      const res = await fetch(student ? `/api/students/${student.id}` : "/api/students", {
        method: student ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(json.error ?? "Could not save. Try again.");
        return;
      }

      toast.success(student ? "Student updated." : "Student added.");
      onSaved();
    } catch {
      toast.error("Network error. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-xl sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-midnight">
            {student ? "Edit student" : "Add student"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-midnight/50 transition hover:text-midnight"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <Field
            label="Full name"
            icon="user"
            name="name"
            type="text"
            required
            defaultValue={student?.name}
          />

          <Field
            label="Student ID"
            icon="tag"
            name="studentId"
            type="text"
            required
            defaultValue={student?.studentId}
            placeholder="STU/2024/001"
          />

          <SelectField
            label="Department"
            icon="tag"
            name="department"
            required
            defaultValue={student?.department ?? ""}
          >
            <option value="" disabled>
              Select a department
            </option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Level"
            icon="tag"
            name="level"
            required
            defaultValue={student?.level ?? ""}
          >
            <option value="" disabled>
              Select a level
            </option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l} Level
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Status"
            icon="tag"
            name="status"
            required
            defaultValue={student?.status ?? "Active"}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </SelectField>

          <Field
            label="Email (optional)"
            icon="mail"
            name="email"
            type="email"
            defaultValue={student?.email}
          />

          <Field
            label="Phone (optional)"
            icon="user"
            name="phone"
            type="tel"
            defaultValue={student?.phone}
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-ocean px-4 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : student ? "Save changes" : "Add student"}
          </button>
        </form>
      </div>
    </div>
  );
}

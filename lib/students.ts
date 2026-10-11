import type { Student } from "./types";

const STUDENT_STATUSES = ["Active", "On Leave", "Graduated"] as const;

export type StudentInput = {
  name: string;
  studentId: string;
  department: string;
  level: number;
  status: (typeof STUDENT_STATUSES)[number];
  email: string;
  phone: string;
};

export function parseStudent(body: unknown): {
  data: StudentInput | null;
  error: string | null;
} {
  const b =
    typeof body === "object" && body !== null && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : {};
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const studentId = typeof b.studentId === "string" ? b.studentId.trim() : "";
  const department = typeof b.department === "string" ? b.department.trim() : "";
  const level = Number(b.level);
  const status = typeof b.status === "string" ? b.status : "Active";
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";

  if (name.length < 2) {
    return { data: null, error: "Enter the student's full name." };
  }
  if (!studentId) {
    return { data: null, error: "Enter a student ID." };
  }
  if (!department) {
    return { data: null, error: "Enter a department." };
  }
  if (![100, 200, 300, 400, 500].includes(level)) {
    return { data: null, error: "Choose a valid level." };
  }
  if (!(STUDENT_STATUSES as readonly string[]).includes(status)) {
    return { data: null, error: "Choose a valid status." };
  }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return { data: null, error: "Enter a valid email address." };
  }

  return {
    data: {
      name,
      studentId,
      department,
      level,
      status: status as StudentInput["status"],
      email,
      phone,
    },
    error: null,
  };
}

export type StudentDoc = {
  _id: unknown;
  name: string;
  studentId: string;
  department: string;
  level: number;
  status: string;
  email?: string;
  phone?: string;
  createdAt: Date | string;
};

export function serializeStudent(student: StudentDoc): Student {
  return {
    id: String(student._id),
    name: student.name,
    studentId: student.studentId,
    department: student.department,
    level: student.level,
    status: student.status as Student["status"],
    email: student.email ?? "",
    phone: student.phone ?? "",
    createdAt: new Date(student.createdAt).toISOString(),
  };
}

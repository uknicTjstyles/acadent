import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { parseStudent, serializeStudent, type StudentDoc } from "@/lib/students";
import Student from "@/models/Student";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const department = searchParams.get("department");
  const status = searchParams.get("status");

  const filter: Record<string, unknown> = {};
  if (department) filter.department = department;
  if (status) filter.status = status;
  if (q) {
    const rx = { $regex: escapeRegex(q), $options: "i" };
    filter.$or = [{ name: rx }, { studentId: rx }, { department: rx }];
  }

  await connectDB();
  const items = (await Student.find(filter)
    .sort({ createdAt: -1 })
    .limit(500)
    .lean()) as StudentDoc[];

  return NextResponse.json({ students: items.map(serializeStudent) });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    const { data, error } = parseStudent(body);

    if (!data) {
      return NextResponse.json({ error }, { status: 400 });
    }

    await connectDB();

    const existing = await Student.findOne({ studentId: data.studentId });
    if (existing) {
      return NextResponse.json(
        { error: "A student with this ID already exists." },
        { status: 409 }
      );
    }

    const created = await Student.create(data);
    return NextResponse.json(
      { student: serializeStudent(created.toObject()) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Student route error:", error);
    return NextResponse.json(
      { error: "Something went wrong while saving the student." },
      { status: 500 }
    );
  }
}

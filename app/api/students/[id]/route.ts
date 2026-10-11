import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { parseStudent, serializeStudent, type StudentDoc } from "@/lib/students";
import Student from "@/models/Student";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await connectDB();
    const student = (await Student.findById(id).lean()) as StudentDoc | null;

    if (!student) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ student: serializeStudent(student) });
  } catch (error) {
    console.error("Get student error:", error);
    return NextResponse.json(
      { error: "Something went wrong while loading the student." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await req.json().catch(() => null);
    const { data, error } = parseStudent(body);

    if (!data) {
      return NextResponse.json({ error }, { status: 400 });
    }

    await connectDB();

    const duplicate = await Student.findOne({
      studentId: data.studentId,
      _id: { $ne: id },
    });

    if (duplicate) {
      return NextResponse.json(
        { error: "Another student already uses this ID." },
        { status: 409 }
      );
    }

    const updated = (await Student.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean()) as StudentDoc | null;

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ student: serializeStudent(updated) });
  } catch (error) {
    console.error("Update student error:", error);
    return NextResponse.json(
      { error: "Something went wrong while updating the student." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await connectDB();
    const deleted = await Student.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete student error:", error);
    return NextResponse.json(
      { error: "Something went wrong while deleting the student." },
      { status: 500 }
    );
  }
}

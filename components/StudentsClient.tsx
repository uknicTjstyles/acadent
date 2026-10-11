'use client';

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/ConfirmDialog";
import StudentDetails from "@/components/StudentDetails";
import StudentForm from "@/components/StudentForm";
import { DEPARTMENTS, STATUSES } from "@/lib/departments";
import type { Student } from "@/lib/types";

const statusStyle: Record<Student["status"], string> = {
	Active: "bg-emerald-100 text-emerald-700",
	"On Leave": "bg-amber-100 text-amber-700",
	Graduated: "bg-sky-100 text-sky-700",
};

export default function StudentsClient() {
	const [students, setStudents] = useState<Student[]>([]);
	const [query, setQuery] = useState("");
	const [department, setDepartment] = useState("");
	const [status, setStatus] = useState("");
	const [refreshKey, setRefreshKey] = useState(0);
	const [loading, setLoading] = useState(true);
	const [editingStudent, setEditingStudent] = useState<Student | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
	const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		const controller = new AbortController();

		async function loadStudents() {
			setLoading(true);
			const params = new URLSearchParams();
			if (query.trim()) params.set("q", query.trim());
			if (department) params.set("department", department);
			if (status) params.set("status", status);

			try {
				const response = await fetch(`/api/students?${params}`, {
					signal: controller.signal,
				});
				const result = (await response.json()) as {
					students?: Student[];
					error?: string;
				};
				if (!response.ok) {
					throw new Error(result.error ?? "Could not load students.");
				}
				setStudents(result.students ?? []);
			} catch (error) {
				if (controller.signal.aborted) return;
				setStudents([]);
				toast.error(
					error instanceof Error ? error.message : "Could not load students."
				);
			} finally {
				if (!controller.signal.aborted) setLoading(false);
			}
		}

		void loadStudents();
		return () => controller.abort();
	}, [query, department, status, refreshKey]);

	async function deleteStudent() {
		if (!deletingStudent) return;

		setDeleting(true);
		try {
			const response = await fetch(`/api/students/${deletingStudent.id}`, {
				method: "DELETE",
			});
			const result = (await response.json().catch(() => ({}))) as {
				error?: string;
			};
			if (!response.ok) {
				throw new Error(result.error ?? "Could not delete student.");
			}

			toast.success("Student deleted.");
			setDeletingStudent(null);
			setRefreshKey((key) => key + 1);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Could not delete student."
			);
		} finally {
			setDeleting(false);
		}
	}

	function openForm(student: Student | null = null) {
		setEditingStudent(student);
		setShowForm(true);
	}

	function closeForm() {
		setShowForm(false);
		setEditingStudent(null);
	}

	function handleSaved() {
		closeForm();
		setRefreshKey((key) => key + 1);
	}

	return (
		<section>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="font-heading text-2xl font-semibold text-midnight">
						Students
					</h1>
					<p className="mt-1 text-sm text-midnight/60">
						{students.length} {students.length === 1 ? "record" : "records"}
					</p>
				</div>
				<button
					type="button"
					onClick={() => openForm()}
					className="rounded-lg bg-ocean px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
				>
					+ Add student
				</button>
			</div>

			<div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1fr)_minmax(12rem,0.7fr)_minmax(10rem,0.6fr)]">
				<label className="sr-only" htmlFor="student-search">
					Search students
				</label>
				<input
					id="student-search"
					type="search"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="Search name, ID, or department"
					className="min-w-0 rounded-lg border border-cloud bg-white px-3 py-2.5 text-sm text-midnight outline-none focus:border-ocean"
				/>
				<label className="sr-only" htmlFor="department-filter">
					Filter by department
				</label>
				<select
					id="department-filter"
					value={department}
					onChange={(event) => setDepartment(event.target.value)}
					className="min-w-0 rounded-lg border border-cloud bg-white px-3 py-2.5 text-sm text-midnight outline-none focus:border-ocean"
				>
					<option value="">All departments</option>
					{DEPARTMENTS.map((item) => (
						<option key={item} value={item}>
							{item}
						</option>
					))}
				</select>
				<label className="sr-only" htmlFor="status-filter">
					Filter by status
				</label>
				<select
					id="status-filter"
					value={status}
					onChange={(event) => setStatus(event.target.value)}
					className="min-w-0 rounded-lg border border-cloud bg-white px-3 py-2.5 text-sm text-midnight outline-none focus:border-ocean"
				>
					<option value="">All statuses</option>
					{STATUSES.map((item) => (
						<option key={item} value={item}>
							{item}
						</option>
					))}
				</select>
			</div>

			<div className="mt-4 overflow-x-auto rounded-lg border border-cloud bg-white">
				<table className="w-full min-w-[760px] border-collapse text-left text-sm">
					<thead className="border-b border-cloud bg-cloud/40 text-xs uppercase text-midnight/60">
						<tr>
							<th className="px-4 py-3 font-medium">Student</th>
							<th className="px-4 py-3 font-medium">Student ID</th>
							<th className="px-4 py-3 font-medium">Department</th>
							<th className="px-4 py-3 font-medium">Level</th>
							<th className="px-4 py-3 font-medium">Status</th>
							<th className="px-4 py-3 text-right font-medium">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-cloud">
						{loading ? (
							<tr>
								<td colSpan={6} className="px-4 py-10 text-center text-midnight/60">
									Loading students...
								</td>
							</tr>
						) : students.length === 0 ? (
							<tr>
								<td colSpan={6} className="px-4 py-10 text-center text-midnight/60">
									No students found.
								</td>
							</tr>
						) : (
							students.map((student) => (
								<tr key={student.id}>
									<td className="px-4 py-3 font-medium text-midnight">
										{student.name}
									</td>
									<td className="px-4 py-3 text-midnight/70">{student.studentId}</td>
									<td className="px-4 py-3 text-midnight/70">{student.department}</td>
									<td className="px-4 py-3 text-midnight/70">{student.level}</td>
									<td className="px-4 py-3">
										<span
											className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle[student.status]}`}
										>
											{student.status}
										</span>
									</td>
									<td className="px-4 py-3">
										<div className="flex justify-end gap-3 whitespace-nowrap">
											<button
												type="button"
												onClick={() => setViewingStudent(student)}
												className="font-medium text-ocean underline"
											>
												View
											</button>
											<button
												type="button"
												onClick={() => openForm(student)}
												className="font-medium text-midnight underline"
											>
												Edit
											</button>
											<button
												type="button"
												onClick={() => setDeletingStudent(student)}
												className="font-medium text-danger underline"
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{showForm && (
				<StudentForm
					student={editingStudent}
					onClose={closeForm}
					onSaved={handleSaved}
				/>
			)}
			{viewingStudent && (
				<StudentDetails
					student={viewingStudent}
					onClose={() => setViewingStudent(null)}
				/>
			)}
			{deletingStudent && (
				<ConfirmDialog
					title="Delete student?"
					message={`This will permanently delete ${deletingStudent.name}'s record.`}
					confirmLabel="Delete student"
					busy={deleting}
					onConfirm={deleteStudent}
					onCancel={() => setDeletingStudent(null)}
				/>
			)}
		</section>
	);
}

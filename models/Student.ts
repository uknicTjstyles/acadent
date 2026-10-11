import mongoose, { Schema } from "mongoose";

const StudentSchema = new Schema(
  {
      name: { type: String, required: true, trim: true },
          studentId: { type: String, required: true, unique: true, trim: true },
              department: { type: String, required: true, trim: true },
                  level: { type: Number, required: true, enum: [100, 200, 300, 400, 500] },
                      status: {
                            type: String,
                                  enum: ["Active", "On Leave", "Graduated"],
                                        default: "Active",
                                            },
                                                email: { type: String, trim: true, lowercase: true, default: "" },
                                                    phone: { type: String, trim: true, default: "" },
                                                      },
                                                        { timestamps: true }
                                                        );

                                                        const Student =
                                                          mongoose.models.Student || mongoose.model("Student", StudentSchema);
                                                          export default Student;
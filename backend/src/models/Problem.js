import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, default: "" },
    output: { type: String, default: "" },
    explanation: { type: String, default: "" },
  },
  { _id: false }
);

const descriptionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    notes: { type: [String], default: [] },
  },
  { _id: false }
);

const starterCodeSchema = new mongoose.Schema(
  {
    javascript: { type: String, default: "" },
    python: { type: String, default: "" },
    java: { type: String, default: "" },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    category: { type: String, default: "" },
    description: {
      type: descriptionSchema,
      required: true,
      default: () => ({ text: "", notes: [] }),
    },
    examples: {
      type: [exampleSchema],
      default: [],
    },
    constraints: {
      type: [String],
      default: [],
    },
    starterCode: {
      type: starterCodeSchema,
      default: () => ({
        javascript: "",
        python: "",
        java: "",
      }),
    },
    expectedOutput: {
      type: starterCodeSchema,
      default: () => ({
        javascript: "",
        python: "",
        java: "",
      }),
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;

import Problem from "../models/Problem.js";

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getAllProblems(req, res) {
  try {
    const problems = await Problem.find({ sessionId: null }).sort({ createdAt: -1 });
    res.status(200).json({ problems });
  } catch (error) {
    console.error("Error in getAllProblems:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getProblemById(req, res) {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.status(200).json({ problem });
  } catch (error) {
    console.error("Error in getProblemById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getProblemBySlug(req, res) {
  try {
    const { slug } = req.params;
    const problem = await Problem.findOne({ slug, sessionId: null });
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.status(200).json({ problem });
  } catch (error) {
    console.error("Error in getProblemBySlug:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createProblem(req, res) {
  try {
    const body = req.body;
    const slug = body.slug || slugify(body.title) || `problem-${Date.now()}`;

    const problem = await Problem.create({
      title: body.title,
      slug,
      difficulty: body.difficulty || "Easy",
      category: body.category || "",
      description: {
        text: body.description?.text || "",
        notes: body.description?.notes || [],
      },
      examples: body.examples || [],
      constraints: body.constraints || [],
      starterCode: body.starterCode || { javascript: "", python: "", java: "" },
      expectedOutput: body.expectedOutput || { javascript: "", python: "", java: "" },
      sessionId: null,
    });

    res.status(201).json({ problem });
  } catch (error) {
    console.error("Error in createProblem:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateProblem(req, res) {
  try {
    const { id } = req.params;
    const body = req.body;

    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    if (problem.sessionId) {
      return res.status(400).json({ message: "Cannot edit session-linked custom problems" });
    }

    const updates = {};
    if (body.title != null) updates.title = body.title;
    if (body.slug != null) updates.slug = body.slug;
    if (body.difficulty != null) updates.difficulty = body.difficulty;
    if (body.category != null) updates.category = body.category;
    if (body.description != null) updates.description = body.description;
    if (body.examples != null) updates.examples = body.examples;
    if (body.constraints != null) updates.constraints = body.constraints;
    if (body.starterCode != null) updates.starterCode = body.starterCode;
    if (body.expectedOutput != null) updates.expectedOutput = body.expectedOutput;

    const updated = await Problem.findByIdAndUpdate(id, { $set: updates }, { new: true });
    res.status(200).json({ problem: updated });
  } catch (error) {
    console.error("Error in updateProblem:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteProblem(req, res) {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    await Problem.findByIdAndDelete(id);
    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProblem:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

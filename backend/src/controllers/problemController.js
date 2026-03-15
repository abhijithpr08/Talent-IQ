import Problem from "../models/Problem.js";

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getAllProblems(req, res) {
  console.log("getAllProblems: Fetching all problems");
  try {
    const problems = await Problem.find({ sessionId: null }).sort({ createdAt: -1 });
    console.log("getAllProblems: Found", problems.length, "problems");
    res.status(200).json({ problems });
  } catch (error) {
    console.log("getAllProblems: Error occurred:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getProblemById(req, res) {
  console.log("getProblemById: Fetching problem by ID:", req.params.id);
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);
    if (!problem) {
      console.log("getProblemById: Problem not found");
      return res.status(404).json({ message: "Problem not found" });
    }
    console.log("getProblemById: Problem found");
    res.status(200).json({ problem });
  } catch (error) {
    console.log("getProblemById: Error occurred:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getProblemBySlug(req, res) {
  console.log("getProblemBySlug: Fetching problem by slug:", req.params.slug);
  try {
    const { slug } = req.params;
    const problem = await Problem.findOne({ slug, sessionId: null });
    if (!problem) {
      console.log("getProblemBySlug: Problem not found");
      return res.status(404).json({ message: "Problem not found" });
    }
    console.log("getProblemBySlug: Problem found");
    res.status(200).json({ problem });
  } catch (error) {
    console.log("getProblemBySlug: Error occurred:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createProblem(req, res) {
  console.log("createProblem: Creating new problem");
  console.log("createProblem: Request body:", req.body);
  try {
    const body = req.body;
    const slug = body.slug || slugify(body.title) || `problem-${Date.now()}`;
    console.log("createProblem: Generated slug:", slug);

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
    console.log("createProblem: Problem created with ID:", problem._id);
    res.status(201).json({ problem });
  } catch (error) {
    console.log("createProblem: Error occurred:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateProblem(req, res) {
  console.log("updateProblem: Updating problem ID:", req.params.id);
  console.log("updateProblem: Update data:", req.body);
  try {
    const { id } = req.params;
    const body = req.body;

    const problem = await Problem.findById(id);
    if (!problem) {
      console.log("updateProblem: Problem not found");
      return res.status(404).json({ message: "Problem not found" });
    }
    if (problem.sessionId) {
      console.log("updateProblem: Cannot edit session-linked problem");
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
    console.log("updateProblem: Problem updated successfully");
    res.status(200).json({ problem: updated });
  } catch (error) {
    console.log("updateProblem: Error occurred:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteProblem(req, res) {
  console.log("deleteProblem: Deleting problem ID:", req.params.id);
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);
    if (!problem) {
      console.log("deleteProblem: Problem not found");
      return res.status(404).json({ message: "Problem not found" });
    }

    await Problem.findByIdAndDelete(id);
    console.log("deleteProblem: Problem deleted successfully");
    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.log("deleteProblem: Error occurred:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const PROBLEM_TEMPLATE = {
  title: "",
  difficulty: "Easy",
  category: "",
  description: {
    text: "",
    notes: [],
  },
  examples: [
    { input: "", output: "", explanation: "" },
  ],
  constraints: [""],
  starterCode: {
    javascript: `function solve() {
  // Write your solution here
  return;
}

// Test cases
console.log(solve());`,
    python: `def solve():
    # Write your solution here
    pass

# Test cases
print(solve())`,
    java: `class Solution {
    public static void solve() {
        // Write your solution here
    }
    
    public static void main(String[] args) {
        solve();
    }
}`,
  },
  expectedOutput: {
    javascript: "",
    python: "",
    java: "",
  },
};

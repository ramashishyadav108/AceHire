import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { problemId, code, testCases } = await req.json();

    // Create a prompt to evaluate the solution
    const prompt = `Evaluate the following Python solution for a DSA problem:
    
    Problem ID: ${problemId}
    Solution Code:
    ${code}
    
    Test Cases:
    ${JSON.stringify(testCases, null, 2)}
    
    Please evaluate the solution and provide:
    1. Whether each test case passes or fails
    2. The actual output for each test case
    3. Any runtime errors or issues
    4. Time and space complexity analysis
    5. Suggestions for improvement
    
    Return in JSON format with the following structure:
    {
      "results": {
        "allPassed": boolean,
        "testCases": [
          {
            "passed": boolean,
            "output": ...,
            "error": "Error message if any"
          }
        ],
        "complexity": {
          "time": "O(...)",
          "space": "O(...)"
        },
        "suggestions": ["Suggestion 1", "Suggestion 2", ...]
      }
    }`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const results = JSON.parse(text);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error evaluating DSA solution:", error);
    return NextResponse.json(
      { error: "Failed to evaluate solution" },
      { status: 500 }
    );
  }
} 
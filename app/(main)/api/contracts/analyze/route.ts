import { NextResponse } from "next/server";
import mammoth from "mammoth";
import pdf from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Configure accepted file types and their processors
const FILE_PROCESSORS = {
  "application/pdf": async (buffer: Buffer) => {
    try {
      console.log("Processing PDF, buffer size:", buffer.length);
      const data = await pdf(buffer);
      console.log("PDF processed successfully, text length:", data.text.length);
      return data.text;
    } catch (error) {
      console.error("PDF processing error:", error);
      throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    async (buffer: Buffer) => {
      try {
        console.log("Processing DOCX, buffer size:", buffer.length);
        const result = await mammoth.extractRawText({ buffer });
        console.log("DOCX processed successfully, text length:", result.value.length);
        return result.value;
      } catch (error) {
        console.error("DOCX processing error:", error);
        throw new Error(`Failed to process DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
} as const;

type FileType = keyof typeof FILE_PROCESSORS;

const ANALYSIS_PROMPT = `
  Analyze the following document and extract:
    - All monetary amounts (including their currency), what they are for, and where they appear
    - All tasks, deliverables, and obligations (including descriptions, due dates, responsible parties, and details)

    Your response should include only a JSON object with two properties, an "amounts" array and a "tasks" arrays, each related to their respective data, nothing else other than that should be included alongside your answer, example below:

    {
    "amounts": [
      {
        "amount": "$1.500",
        "currency": "USD",
        "for": "Full compensation for the services provided under this agreement",
        "location": "Section 2.1"
      }
    ],
    "tasks": [
      "Create and deliver one high-quality, professionally photographed image featuring SparkleFizzCo.'s flagship beverage, SparkleFizz Original Citrus.",
      "Deliver one primary image and two social media adaptations optimized for Instagram.",
      "Submit the final image for Brand's approval."
    ]
  }

    Be sure to strictly follow the data structure exemplified above, and to start all sentences with an uppercase letter.

    Below you will find the content for the document to be analyzed:
`;

export async function POST(req: Request) {
  if (!req.body) {
    return NextResponse.json({ error: "No body provided" }, { status: 400 });
  }

  try {
    console.log("Starting document analysis...");
    
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("File received:", {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Check if file type is supported
    if (!(file.type in FILE_PROCESSORS)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF or DOCX file." },
        { status: 400 }
      );
    }

    // Validate file size (optional: add a reasonable limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Process file
    console.log("Converting file to buffer...");
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log("Processing file content...");
    const textContent = await FILE_PROCESSORS[file.type as FileType](buffer);

    if (!textContent || textContent.trim().length === 0) {
      return NextResponse.json(
        { error: "No text content could be extracted from the file" },
        { status: 400 }
      );
    }

    console.log("Text extracted, length:", textContent.length);
    console.log("First 200 chars:", textContent.substring(0, 200));

    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Analyze with Gemini
    console.log("Sending to Gemini for analysis...");
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(`${ANALYSIS_PROMPT} ${textContent}`);
    const response = await result.response;
    const responseText = response.text();
    
    console.log("Gemini response received:", responseText.substring(0, 200));

    let analysisResult;
    try {
      analysisResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Raw response:", responseText);
      return NextResponse.json(
        { 
          error: "Failed to parse AI response",
          details: "The AI response was not valid JSON"
        },
        { status: 500 }
      );
    }

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Error analyzing document:", error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Failed to analyze document",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Send a POST request with a PDF or DOCX file to analyze",
    supportedTypes: Object.keys(FILE_PROCESSORS),
  });
}
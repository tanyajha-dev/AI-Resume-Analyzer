import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent("Say Hello");

    console.log("✅ SUCCESS:");
    console.log(result.response.text());

  } catch (error) {
    console.log("❌ ERROR:");
    console.log(error);
  }
}

testGemini();
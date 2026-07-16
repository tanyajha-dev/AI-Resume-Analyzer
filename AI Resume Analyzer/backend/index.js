import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import Analysis from "./models/Analysis.js";
import axios from "axios";

dotenv.config();
connectDB();
console.log("NEW INDEX FILE RUNNING");
console.log("TANU BACKEND 12345");
console.log(process.env.GEMINI_API_KEY?.substring(0, 10));
console.log(process.env.GEMINI_API_KEY?.startsWith("AQ"));

const app = express();
// eslint-disable-next-line no-undef
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
console.log("AUTH ROUTES MOUNTED");

app.get("/", (req, res) => {
  res.send("AI Resume Analyzer ✅");
});
async function getAIAnalysis(resumeText) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Analyze this resume.

Return ONLY valid JSON:

{
  "atsScore": 0,
  "skills": [],
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "jobKeyword": "",
  "relatedRoles": []
}
  Example Output:

{
  "atsScore": 85,
  "skills": ["React", "JavaScript", "HTML", "CSS"],
  "strengths": ["Strong frontend skills"],
  "weaknesses": [],
  "suggestions": [],
  "jobKeyword": "Frontend Developer",
  "relatedRoles": [
    "React Developer",
    "UI Developer",
    "Web Developer",
    "Frontend Engineer"
  ]
    Important:
Use the actual ATS score calculated from the resume.
Do not copy the ATS score from the example output.
}
  Instructions:

- Generate the most suitable job title based on the resume skills and experience
- jobKeyword is mandatory
- Return exactly one job title
- jobKeyword should be a real searchable role such as:
  Frontend Developer
  Backend Developer
  Full Stack Developer
  AI Engineer
  Customer Support Executive
  Digital Marketing Executive
  Accountant
  Data Analyst
  Real Estate Sales Executive
- Do not omit any field from the JSON response
- relatedRoles is mandatory
- Return 3 to 5 related job roles based on the resume
- relatedRoles must contain at least 3 job roles
- relatedRoles cannot be empty
- If the resume contains React, JavaScript, HTML, CSS, Tailwind:
  - jobKeyword = "Frontend Developer"
  - relatedRoles should include:
    - React Developer
    - UI Developer
    - Web Developer
    - Frontend Engineer

-If the resume contains Node.js, Express, MongoDB:
-jobKeyword = "Backend Developer"

-relatedRoles should include:
 -Node.js Developer
 -API Developer
 -Backend Engineer
 -Express.js Developer

-If the resume contains React, Node.js, MongoDB:
-jobKeyword = "Full Stack Developer"

-relatedRoles should include:
 -MERN Stack Developer
 -JavaScript Developer
 -Full Stack Engineer
 -Web Application Developer

-If the resume contains Python, AI, Machine Learning:
-jobKeyword = "AI Engineer"

-relatedRoles should include:
 -Machine Learning Engineer
 -AI Developer
 -Python Developer
 -Data Scientist

relatedRoles cannot be empty.
- Prefer specific job roles over generic roles.
- Do not use "Software Developer" unless no specific role can be determined.
Resume:
${resumeText}
`;

    let result;

    for (let i = 0; i < 3; i++) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (err) {
        console.log("Retry:", i + 1);

        if (i === 2) throw err;

        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    console.log("Gemini Success");

    const response = await result.response;

    console.log(response.text());
    console.log("RAW GEMINI RESPONSE:");
    console.log(response.text());

    return response.text();
  } catch (error) {
    console.log("Gemini Error:", error);

    return JSON.stringify({
      atsScore: 0,
      skills: [],
      strengths: [],
      weaknesses: [],
      suggestions: [],
      jobKeyword: "Software Developer",
    });
  }
}

app.post("/analyze", async (req, res) => {
  console.log("Analyze Resume Analyzer ✅");
  const { resumeText, userId } = req.body;
  console.log("Resume Length:", resumeText?.length);
  console.log("Resume Preview:");
  console.log(resumeText?.substring(0, 500));

  const skillsDatabase = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node",
    "Express",
    "MongoDB",
    "Git",
    "GitHub",
    "API",
    "Tailwind",
    "Redux",
    "Next.js",
    "Python",
    "Java",
    "SQL",
  ];

  const foundSkills = skillsDatabase.filter((skill) =>
    resumeText.toLowerCase().includes(skill.toLowerCase()),
  );

  let score = 0;

  // Skills Score (40 Marks)
  score += (foundSkills.length / skillsDatabase.length) * 40;

  // Projects Section (20 Marks)
  if (/project|projects/i.test(resumeText)) {
    score += 20;
  }

  // Education Section (10 Marks)
  if (/education|degree|b\.tech|bachelor|university/i.test(resumeText)) {
    score += 10;
  }

  // Email Present (10 Marks)
  if (/@/.test(resumeText)) {
    score += 10;
  }

  // LinkedIn / GitHub Present (10 Marks)
  if (/linkedin|github/i.test(resumeText)) {
    score += 10;
  }

  // Resume Length (10 Marks)
  if (resumeText.length > 1000) {
    score += 10;
  }

  const strengths = [];

  if (foundSkills.length >= 5) {
    strengths.push("Good technical skill set");
  }

  if (/project|projects/i.test(resumeText)) {
    strengths.push("Projects section found");
  }

  if (/linkedin|github/i.test(resumeText)) {
    strengths.push("Professional profile links available");
  }

  const suggestions = [];
  let aiStrengths = [];
  let aiWeaknesses = [];
  let aiSuggestions = [];
  let aiSkills = [];
  let aiAtsScore = 0;
  let aiJobKeyword = "Software Developer";
  let aiRelatedRoles = [];

  try {
    const aiResponse = await getAIAnalysis(resumeText);
    console.log("Gemini Response:", aiResponse);

    if (aiResponse) {
      const cleaned = aiResponse.replace(/```json/g, "").replace(/```/g, "");
      console.log("Cleaned AI Response:", cleaned);
      const parsed = JSON.parse(cleaned);

      aiStrengths = parsed.strengths || [];
      aiWeaknesses = parsed.weaknesses || [];
      aiSuggestions = parsed.suggestions || [];
      aiSkills = parsed.skills || [];
      aiAtsScore = parsed.atsScore || 0;
      aiJobKeyword = parsed.jobKeyword || "Software Developer";
      aiRelatedRoles = parsed.relatedRoles || [];
    }
  } catch (err) {
    console.log("AI Parse Error:", err);
  }

  if (foundSkills.length < 5) {
    suggestions.push("Add more relevant technical skills");
  }
  if (!/project|projects/i.test(resumeText)) {
    suggestions.push("Add project section");
  }

  if (!/linkedin/i.test(resumeText)) {
    suggestions.push("Add LinkedIn profile");
  }

  if (!/github/i.test(resumeText)) {
    suggestions.push("Add GitHub profile");
  }

  try {
    console.log("Trying to save analysis...");
    await Analysis.create({
      userId,
      fileName: "Resume",
      atsScore: aiAtsScore || Math.round(score),

      skills: aiSkills.length > 0 ? aiSkills : foundSkills,

      strengths: [...strengths, ...aiStrengths],

      suggestions: [...suggestions, ...aiSuggestions],
    });

    console.log("Analysis Saved Successfully");
  } catch (err) {
    console.log("Save Error:", err);
  }

  res.json({
    success: true,
    atsScore: aiAtsScore || Math.round(score),

    skills: aiSkills.length > 0 ? aiSkills : foundSkills,

    strengths: [...strengths, ...aiStrengths],

    weaknesses: aiWeaknesses,

    suggestions: [...suggestions, ...aiSuggestions],

    jobKeyword: aiJobKeyword,
    relatedRoles: aiRelatedRoles,
  });
});
console.log("JOBS ROUTE REGISTERED");
app.get("/jobs", async (req, res) => {
  console.log("ADZUNA ROUTE RUNNING");
  try {
    const keyword = req.query.keyword || "Software Developer";

    console.log("Searching Jobs:", keyword);

    const response = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/in/search/1`,
      {
        params: {
          app_id: process.env.ADZUNA_APP_ID,
          app_key: process.env.ADZUNA_APP_KEY,
          results_per_page: 10,
          what: keyword,
        },
      },
    );

    const jobs = response.data.results.map((job) => ({
      title: job.title,
      company: job.company?.display_name || "Unknown Company",
      location: job.location?.display_name || "Unknown Location",
      url: job.redirect_url,
    }));

    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.log("Jobs API Error:", error.message);

    res.status(500).json({
      success: false,
      jobs: [],
    });
  }
});
app.get("/history", async (req, res) => {
  try {
    const { userId } = req.query;

    const analyses = await Analysis.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    res.json(analyses);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching history",
    });
  }
});

app.delete("/history/:id", async (req, res) => {
  try {
    await Analysis.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Analysis Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete Failed",
    });
  }
});
app.get("/test", (req, res) => {
  console.log("TEST ROUTE HIT");
  res.send("Backend Working");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
console.log("FILE LOADED");

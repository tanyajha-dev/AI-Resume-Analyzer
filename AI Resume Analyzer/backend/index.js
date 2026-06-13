import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

app.post("/analyze", (req, res) => {
  const { resumeText } = req.body;

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
    resumeText.toLowerCase().includes(skill.toLowerCase())
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

  res.json({
    success: true,
    atsScore: Math.round(score),
    skills: foundSkills,
    strengths,
    suggestions,
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
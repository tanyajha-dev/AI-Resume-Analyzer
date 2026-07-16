import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";

import { useDropzone } from "react-dropzone";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

//import { askAI } from "../services/puter";
import jsPDF from "jspdf";

import { readDocx, readPdf } from "./services/parser";
import { analyzeResume } from "./services/api";
import Login from "./components/Login";
import Register from "./components/Register";
import History from "./components/History";
import LandingPage from "./components/LandingPage";

function App() {
  const [showLanding, setShowLanding] = useState(true);
  useEffect(() => {
    const previousOnError = window.onerror;

    window.onerror = function (msg) {
      console.log("GLOBAL ERROR:", msg);
      return false;
    };

    return () => {
      window.onerror = previousOnError;
    };
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);
  const [result, setResult] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [atsScore, setAtsScore] = useState("0%");
  const [skills, setSkills] = useState([]);
  const [jobKeyword, setJobKeyword] = useState("");
  const [jobs, setJobs] = useState([
    {
      title: "Frontend Developer",
      company: "Google",
      location: "Bangalore",
      skills: ["HTML", "CSS", "JavaScript", "React"],
    },
    {
      title: "React Developer",
      company: "Microsoft",
      location: "Hyderabad",
      skills: ["React", "JavaScript", "Redux"],
    },
  ]);

  function calculateMatch(jobSkills = []) {
    if (skills.length === 0 || jobSkills.length === 0) return 0;

    const matched = jobSkills.filter((skill) =>
      skills.some((s) => s.toLowerCase() === skill.toLowerCase()),
    );

    return Math.round((matched.length / jobSkills.length) * 100);
  }
  const [projectCount, setProjectCount] = useState(0);
  const [uploadedText, setUploadedText] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [fileName, setFileName] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  // Reusable file processing
  async function processFile(file) {
    if (!file) return;

    try {
      // Clear old data
      // Clear previous data
      setFileUploaded(false);

      // Clear previous analysis completely
      setResumeText("");
      setUploadedText("");
      setResult("");

      setAtsScore("0%");
      setSkills([]);
      setProjectCount(0);

      setFileUploaded(false);

      // force clear old data immediately
      setTimeout(() => {
        setAtsScore("0%");
        setSkills([]);
      }, 0);

      // Hide old analysis immediately
      setLoading(false);

      let text = "";

      if (file.name.endsWith(".docx")) {
        text = await readDocx(file);
      } else if (file.name.endsWith(".pdf")) {
        text = await readPdf(file);
      } else {
        setResult("Only PDF and DOCX files supported ❌");

        return;
      }

      // Store uploaded resume only
      setUploadedText(text);
      setFileName(file.name);
      setFileUploaded(true);
    } catch (error) {
      console.log("AI Error Full:", error);
      setResult("Error reading file ❌");
    }
  }

  // Drag & Drop
  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    processFile(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });
  async function fetchJobs(keyword) {
    try {
      const response = await fetch(
        "https://www.arbeitnow.com/api/job-board-api",
      );

      const data = await response.json();

      const filteredJobs = data.data
        .filter((job) =>
          job.title.toLowerCase().includes(keyword.toLowerCase()),
        )
        .slice(0, 10);

      const formattedJobs = filteredJobs.map((job) => ({
        title: job.title,
        company: job.company_name,
        location: job.location,
        skills: [],
        url: job.url,
      }));

      setJobs(formattedJobs);
    } catch (error) {
      console.log("Job API Error:", error);
    }
  }
  async function fetchJobs(keyword) {
    try {
      console.log("Searching Jobs For:", keyword);

      const response = await fetch(
        `http://localhost:5000/jobs?keyword=${encodeURIComponent(keyword)}`,
      );

      const data = await response.json();
      console.log("Jobs API Response:", data);

      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.log("Job Fetch Error:", error);
    }
  }
  // AI Analysis
  async function handleAnalyze() {
    console.log("ANALYZE BUTTON CLICKED");
    try {
      if (!uploadedText) {
        // Clear previous analysis before new analysis starts
        setResult("");
        setAtsScore("0%");
        setSkills([]);
        setProjectCount(0);

        setResult("Please upload resume first.");

        return;
      }

      setLoading(true);
      const backendResponse = await analyzeResume(uploadedText);

      console.log(JSON.stringify(backendResponse, null, 2));
      if (backendResponse?.success) {
        setAtsScore(`${backendResponse.atsScore}%`);

        const extractedSkills = backendResponse.skills || [];

        setSkills(extractedSkills);
        setJobKeyword(backendResponse.jobKeyword || "Software Developer");
        fetchJobs(backendResponse.jobKeyword || "Software Developer");
      }
      // Show preview immediately

      let aiText = "";
      // Puter temporarily disabled
      // try {
      //   const response = await askAI(`
      // Analyze this resume and provide:
      //
      // 1. ATS Score
      // 2. Strengths
      // 3. Weaknesses
      // 4. Skills Found
      // 5. Improvement Suggestions
      //
      // Resume:
      // ${uploadedText}
      // `);
      //   aiText = response?.message?.content?.[0]?.text;
      // } catch (error) {
      //   console.log("AI Error:", error);
      // }

      if (!aiText) {
        // Better skill detection
        const detectedSkills = uploadedText.match(
          /HTML|CSS|JavaScript|React|Node|Tailwind|Git|GitHub|MongoDB|Express|Redux|API|Python|Java|C\+\+|SQL|AWS|Bootstrap|Next.js/gi,
        );

        const uniqueSkills = detectedSkills
          ? [...new Set(detectedSkills)]
          : ["General Skills"];
        setSkills(backendResponse?.skills || uniqueSkills);

        // Stable score from resume length
        const score = backendResponse?.atsScore || 0;

        aiText = `
ATS Score: ${score}%

STRENGTHS:
• Resume uploaded successfully
• Resume content extracted

WEAKNESSES:
• AI analysis unavailable

SKILLS FOUND:
${uniqueSkills.map((skill) => "• " + skill).join("\n")}

IMPROVEMENT SUGGESTIONS:
• Add measurable achievements
• Improve ATS keywords
`;
      }

      setResumeText(uploadedText);
      aiText = `ATS Score: ${backendResponse.atsScore}%

Skills Found:
${backendResponse.skills.join(", ")}

Strengths:
${backendResponse.strengths.join("\n")}

Weaknesses:
${backendResponse.weaknesses?.join("\n") || "No weaknesses found"}

Suggestions:
${backendResponse.suggestions.join("\n")}
`;
      setResult(aiText);
      //const scoreMatch = aiText.match(/\d+%|\d+\/100/);

      //setAtsScore(scoreMatch ? scoreMatch[0] : "0%");

      const skillMatches = aiText.match(
        /HTML|CSS|JavaScript|React|Node|Tailwind|Git|GitHub|MongoDB|Express|Redux|API/gi,
      );

      if (skillMatches) {
        setSkills([...new Set(skillMatches)]);
      }

      const projectMatches = uploadedText.match(/project/gi);

      setProjectCount(projectMatches ? projectMatches.length : 0);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);

      setResult("Something went wrong");
    }
  }
  function downloadPDF() {
    if (!result) return;

    const doc = new jsPDF();

    // Clean text properly
    let cleanText = result
      .replace(/[#*`]/g, "")
      .replace(/\|/g, " ")
      .replace(/Strengths/g, "\n\nSTRENGTHS\n")
      .replace(/Weaknesses/g, "\n\nWEAKNESSES\n")
      .replace(/Skills Found/g, "\n\nSKILLS FOUND\n")
      .replace(/Improvement Suggestions/g, "\n\nIMPROVEMENT SUGGESTIONS\n");

    doc.setFontSize(18);
    doc.text("Resume Analysis Report", 20, 20);

    doc.setFontSize(11);

    const lines = doc.splitTextToSize(cleanText, 170);

    let y = 35;

    for (let i = 0; i < lines.length; i++) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.text(lines[i], 20, y);

      y += 7;
    }

    doc.save("resume-analysis.pdf");
  }
  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }
  if (!isLoggedIn) {
    return showRegister ? (
      <Register key="register" onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login
        key="login"
        onLogin={() => setIsLoggedIn(true)}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div
      className={`min-h-screen flex ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Sidebar */}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
      />

      {/* Main */}
      {activeTab === "dashboard" && (
        <div className="flex-1 p-10">
          <h1 className="text-5xl font-bold">AI Resume Analyzer</h1>

          <p className="text-zinc-400 mt-2">
            Upload resume and get AI feedback instantly
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-5 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300">
              <h3 className="text-white/80">ATS Score</h3>

              <p className="text-4xl font-bold mt-3">{atsScore}</p>

              <p className="text-sm mt-2 text-white/70">
                Resume quality analysis
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-5 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300">
              <h3 className="text-white/80">Skills Found</h3>

              <p className="text-4xl font-bold mt-3">{skills.length}</p>

              <p className="text-sm mt-2 text-white/70">
                Skills detected from resume
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-green-500 p-5 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300">
              <h3 className="text-white/80">Projects</h3>

              <p className="text-4xl font-bold mt-3">{projectCount}</p>

              <p className="text-sm mt-2 text-white/70">Projects detected</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-5 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300">
              <h3 className="text-white/80">Status</h3>

              <p className="text-4xl font-bold mt-3">
                {fileUploaded ? "Ready" : "Waiting"}
              </p>

              <p className="text-sm mt-2 text-white/70">Resume upload status</p>
            </div>
          </div>

          {/* Upload Section */}

          <div
            className={`rounded-3xl p-8 mt-10 shadow-xl border ${
              darkMode
                ? "bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-800"
                : "bg-white border-gray-300"
            }`}
          >
            <h2 className="text-3xl font-bold mb-2">Upload Resume</h2>

            <p className="text-zinc-400 mb-6">
              Get ATS score, skills analysis and AI feedback instantly
            </p>

            <div
              {...getRootProps()}
              className={`
      border-2 border-dashed rounded-2xl p-10
      text-center cursor-pointer transition-all
      ${
        isDragActive
          ? "border-purple-400 bg-purple-900/20"
          : "border-zinc-700 hover:border-purple-500 hover:bg-zinc-800"
      }
    `}
            >
              <input {...getInputProps()} />

              <div className="space-y-4">
                <div className="text-7xl animate-bounce">📄</div>

                {isDragActive ? (
                  <p className="text-purple-400 text-xl font-semibold">
                    Drop resume here...
                  </p>
                ) : (
                  <>
                    <p className="text-2xl font-bold">
                      Drag & Drop Resume Here
                    </p>

                    <p className="text-zinc-400">or click to upload</p>

                    <p className="text-sm text-zinc-500">
                      Supported: PDF, DOCX
                    </p>
                  </>
                )}

                {fileUploaded && (
                  <div className="mt-4 p-3 bg-zinc-800 rounded-xl border border-zinc-700">
                    <p className="text-green-400 font-medium">
                      ✅ Resume uploaded successfully
                    </p>

                    <p className="text-zinc-400 text-sm mt-2">
                      Click Analyze Resume
                    </p>
                  </div>
                )}

                {fileName && (
                  <div className="mt-4 bg-gradient-to-r from-zinc-800 to-zinc-900 p-4 rounded-xl border border-purple-500 shadow-lg">
                    <p className="text-sm text-zinc-400">Uploaded Resume</p>

                    <div className="flex items-center justify-between mt-2">
                      <p className="font-semibold text-purple-400">
                        📄 {fileName}
                      </p>

                      <div className="bg-green-500 px-3 py-1 rounded-full text-sm">
                        Ready
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !uploadedText}
              className={`
      w-full px-6 py-4 rounded-2xl mt-6 font-semibold text-lg transition
      ${
        loading || !uploadedText
          ? "bg-zinc-700 cursor-not-allowed"
          : "bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105 hover:shadow-lg transition-all duration-300"
      }
    `}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

                  <div className="flex flex-col">
                    <span>Analyzing Resume...</span>

                    <span className="text-xs text-zinc-300">
                      Extracting skills • Checking ATS • Generating feedback
                    </span>
                  </div>
                </div>
              ) : (
                "Analyze Resume"
              )}
            </button>
          </div>

          {/* Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            <div
              className={`rounded-2xl p-6 ${
                darkMode
                  ? "bg-zinc-900 text-white"
                  : "bg-white text-black shadow-lg"
              }`}
            >
              <h3 className="mb-5 text-2xl font-bold text-purple-400">
                🎯 ATS Score
              </h3>

              <div className="w-32 h-32 mx-auto">
                <CircularProgressbar
                  value={parseInt(atsScore)}
                  text={atsScore}
                  styles={buildStyles({
                    textColor:
                      parseInt(atsScore) <= 40
                        ? "#ef4444"
                        : parseInt(atsScore) <= 70
                          ? "#eab308"
                          : "#22c55e",

                    pathColor:
                      parseInt(atsScore) <= 40
                        ? "#ef4444"
                        : parseInt(atsScore) <= 70
                          ? "#eab308"
                          : "#22c55e",

                    trailColor: "#27272a",
                  })}
                />
              </div>
            </div>

            {parseInt(atsScore) <= 40 && (
              <p className="text-red-500 mt-4 text-center">Needs Improvement</p>
            )}

            {parseInt(atsScore) > 40 && parseInt(atsScore) <= 70 && (
              <p className="text-yellow-500 mt-4 text-center">
                Moderate Resume
              </p>
            )}

            {parseInt(atsScore) > 70 && (
              <p className="text-green-500 mt-4 text-center">
                Excellent Resume
              </p>
            )}

            <div
              className={`rounded-2xl p-6 ${
                darkMode
                  ? "bg-zinc-900 text-white"
                  : "bg-white text-black shadow-lg border"
              }`}
            >
              <h3> Skills </h3>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 px-5 py-3 rounded-full text-white font-semibold shadow-lg border border-white/20 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p>No skills yet</p>
                )}
              </div>
            </div>

            <div
              className={`rounded-2xl p-6 ${
                darkMode
                  ? "bg-zinc-900 text-white"
                  : "bg-white text-black shadow-lg"
              }`}
            >
              <h3>Projects</h3>
              <p className="text-4xl mt-5 font-bold">{projectCount}</p>
            </div>
          </div>

          {/* Resume Preview + Analysis */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
            <div
              className={`p-8 rounded-2xl ${
                darkMode
                  ? "bg-zinc-900 text-white"
                  : "bg-white text-black shadow-lg"
              }`}
            >
              <h2 className="text-2xl mb-5">Resume Preview</h2>

              <div
                className={`max-h-96 overflow-y-auto whitespace-pre-wrap ${
                  darkMode ? "text-zinc-300" : "text-black"
                }`}
              >
                {result
                  ? resumeText.substring(0, 2000)
                  : "Click Analyze Resume first"}
              </div>
            </div>

            <div
              className={`p-8 rounded-2xl ${
                darkMode
                  ? "bg-zinc-900 text-white"
                  : "bg-white text-black shadow-lg"
              }`}
            >
              <h2 className="text-2xl mb-5">Analysis Result</h2>

              <div className="max-h-96 overflow-y-auto whitespace-pre-wrap text-zinc-300">
                {resumeText && result
                  ? result
                  : "Click Analyze Resume to generate Analysis"}
              </div>

              {result && (
                <button
                  onClick={downloadPDF}
                  className="bg-green-600 px-5 py-3 rounded-xl mt-5 hover:bg-green-700"
                >
                  Download Report PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {activeTab === "analysis" && (
        <div className="flex-1 p-10">
          <h1 className="text-5xl font-bold">Resume Analysis Report</h1>

          <p className="text-zinc-400 mt-2">
            Detailed AI feedback and resume evaluation
          </p>

          <div
            className={`p-8 rounded-2xl mt-8 ${
              darkMode
                ? "bg-zinc-900 text-white"
                : "bg-white text-black shadow-lg"
            }`}
          >
            <h2 className="text-2xl font-bold mb-5">Full Analysis Report</h2>

            <div className="whitespace-pre-wrap text-zinc-300 max-h-[500px] overflow-y-auto">
              {result ||
                "Please upload and analyze a resume from Dashboard first"}
            </div>

            {result && (
              <button
                onClick={downloadPDF}
                className="bg-green-600 px-5 py-3 rounded-xl mt-5 hover:bg-green-700"
              >
                Download PDF Report
              </button>
            )}
          </div>
        </div>
      )}
      {activeTab === "jobmatch" && (
        <div className="flex-1 p-10">
          <h1 className="text-5xl font-bold">Job Matches</h1>
          <p className="text-zinc-400 mt-2">
            Recommended jobs for: {jobKeyword || "Analyze a resume first"}
          </p>

          {jobs.map((job, index) => (
            <div
              key={index}
              className={`p-6 rounded-3xl border hover:scale-105 transition-all duration-300 mt-6 ${
                darkMode
                  ? "bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 text-white"
                  : "bg-white text-black shadow-lg border-gray-200"
              }`}
            >
              <p className="text-zinc-400 mt-2">
                {job.company} • {job.location}
              </p>

              <h2 className="text-2xl font-bold text-purple-400 mt-3">
                {job.title}
              </h2>

              <div className="mt-4 inline-block bg-purple-600 px-4 py-2 rounded-full font-semibold">
                {calculateMatch(job.skills || [])}% Match
              </div>

              <div className="w-full bg-zinc-700 rounded-full h-3 mt-4">
                <div
                  className="bg-purple-500 h-3 rounded-full"
                  style={{
                    width: `${calculateMatch(job.skills || [])}%`,
                  }}
                ></div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {(job.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="bg-zinc-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center mt-5 w-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 rounded-xl font-semibold hover:scale-105 transition-all"
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>
      )}
      {activeTab === "history" && <History />}

      {activeTab === "settings" && (
        <div className="flex-1 p-10">
          <h1 className="text-5xl font-bold">Settings</h1>

          <p className="text-zinc-400 mt-2">
            Manage your profile and preferences
          </p>

          <div className="grid md:grid-cols-2 gap-5 mt-10">
            <div
              className={`p-6 rounded-2xl ${
                darkMode
                  ? "bg-zinc-900 text-white"
                  : "bg-white text-black shadow-lg"
              }`}
            >
              <h2 className="text-2xl font-bold">🌙 Theme</h2>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setDarkMode(true)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode ? "bg-purple-600" : "bg-zinc-700"
                  }`}
                >
                  Dark Mode
                </button>

                <button
                  onClick={() => setDarkMode(false)}
                  className={`px-4 py-2 rounded-lg ${
                    !darkMode ? "bg-yellow-500 text-black" : "bg-zinc-700"
                  }`}
                >
                  Light Mode
                </button>
              </div>

              <p className="text-zinc-400 mt-3">
                Current Theme: {darkMode ? "Dark" : "Light"}
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl ${
                darkMode
                  ? "bg-zinc-900 text-white"
                  : "bg-white text-black shadow-lg"
              }`}
            >
              <h2 className="text-2xl font-bold">☀️ Light Mode</h2>

              <button className="bg-zinc-700 px-4 py-2 rounded-lg mt-4">
                Disabled
              </button>
            </div>

            <div
              className={`p-6 rounded-2xl ${
                darkMode
                  ? "bg-zinc-900 text-white"
                  : "bg-white text-black shadow-lg"
              }`}
            >
              <h2 className="text-2xl font-bold">❓ Help & Support</h2>

              <p className="text-zinc-400 mt-3">
                Contact support or read documentation
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

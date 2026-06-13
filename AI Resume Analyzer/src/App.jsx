import { useState } from "react";
import Sidebar from "./components/Sidebar";

import { useDropzone } from "react-dropzone";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

import { askAI } from "./services/puter";
import jsPDF from "jspdf";

import { readDocx, readPdf } from "./services/parser";
import { analyzeResume } from "./services/api";

function App() {
  const [result, setResult] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [atsScore, setAtsScore] = useState("0%");
  const [skills, setSkills] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  const [uploadedText, setUploadedText] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [fileName, setFileName] = useState("");
  const [strengths, setStrengths] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

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

  // AI Analysis
  async function handleAnalyze() {
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

        setSkills(backendResponse.skills || []);
        setStrengths(backendResponse.strengths || []);

        setSuggestions(backendResponse.suggestions || []);
      }
      // Show preview immediately

      let aiText = "";

      try {
        const response = await askAI(
          `
Analyze this resume and provide:

1. ATS Score
2. Strengths
3. Weaknesses
4. Skills Found
5. Improvement Suggestions

Resume:
${uploadedText}
`,
        );

        aiText = response?.message?.content?.[0]?.text;
      } catch (error) {
        console.log("AI Error:", error);
      }

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

      setResult(aiText);
      //const scoreMatch = aiText.match(/\d+%|\d+\/100/);

      //setAtsScore(scoreMatch ? scoreMatch[0] : "0%");

      /*const skillMatches = aiText.match(
        /HTML|CSS|JavaScript|React|Node|Tailwind|Git|GitHub|MongoDB|Express|Redux|API/gi,
      );

      if (skillMatches) {
        setSkills([...new Set(skillMatches)]);
      }
*/
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

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

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

          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 mt-10 shadow-xl">
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
            <div className="bg-zinc-900 rounded-2xl p-6">
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

            <div className="bg-zinc-900 rounded-2xl p-6">
              <h3 className="mb-5">Skills Found</h3>

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

            <div className="bg-zinc-900 rounded-2xl p-6">
              <h3>Projects</h3>

              <p className="text-4xl mt-5 font-bold">{projectCount}</p>
            </div>
          </div>

          {/* Resume Preview + Analysis */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
            <div className="bg-zinc-900 p-8 rounded-2xl">
              <h2 className="text-2xl mb-5">Resume Preview</h2>

              <div className="max-h-96 overflow-y-auto whitespace-pre-wrap text-zinc-300">
                {result
                  ? resumeText.substring(0, 2000)
                  : "Click Analyze Resume first"}
              </div>
            </div>

            <div className="bg-zinc-900 p-8 rounded-2xl">
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
    </div>
  );
}

export default App;

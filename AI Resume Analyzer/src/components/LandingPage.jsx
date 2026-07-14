function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-center py-32 px-6">
        {/* Background Blur Effects */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full blur-[120px] opacity-30"></div>

        <div className="absolute bottom-10 right-20 w-72 h-72 bg-pink-500 rounded-full blur-[120px] opacity-30"></div>

        <div className="relative z-10">
          <div className="inline-block px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-sm mb-6">
            🚀 AI-Powered Career Growth Platform
          </div>

          <h1 className="text-6xl md:text-7xl font-bold leading-tight">
            Land Your Dream Job
            <br />
            with
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {" "}
              AI Resume Analysis
            </span>
          </h1>

          <p className="text-zinc-400 text-xl max-w-3xl mx-auto mt-8">
            Upload your resume, get ATS insights, AI feedback, and discover
            matching job opportunities instantly.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all"
            >
              Get Started
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="border border-zinc-700 px-8 py-4 rounded-xl hover:bg-zinc-900"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="px-10 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 p-8 rounded-3xl text-center hover:scale-105 transition-all">
            <h3 className="text-4xl font-bold text-purple-400">95%</h3>
            <p className="text-zinc-400 mt-2">ATS Accuracy</p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl text-center hover:scale-105 transition-all">
            <h3 className="text-4xl font-bold text-pink-400">10K+</h3>
            <p className="text-zinc-400 mt-2">Resumes Analyzed</p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl text-center hover:scale-105 transition-all">
            <h3 className="text-4xl font-bold text-cyan-400">500+</h3>
            <p className="text-zinc-400 mt-2">Job Matches</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-10 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Features</h2>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-zinc-900 p-6 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl">🎯 ATS Score</h3>
            <p className="text-zinc-400 mt-3">
              Check resume ATS compatibility.
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl">🧠 AI Analysis</h3>
            <p className="text-zinc-400 mt-3">
              Get AI-powered resume feedback.
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl">💼 Job Match</h3>
            <p className="text-zinc-400 mt-3">Find matching jobs instantly.</p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl">📄 Resume Builder</h3>
            <p className="text-zinc-400 mt-3">Coming Soon.</p>
          </div>
        </div>
      </section>
      <section className="px-10 py-24">
        <h2 className="text-5xl font-bold text-center mb-16">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-900 p-8 rounded-3xl">
            <h3 className="text-3xl mb-4">📄 Upload Resume</h3>
            <p className="text-zinc-400">
              Upload your PDF or DOCX resume in seconds.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl">
            <h3 className="text-3xl mb-4">🧠 AI Analysis</h3>
            <p className="text-zinc-400">
              Gemini AI analyzes your resume and ATS score.
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl">
            <h3 className="text-3xl mb-4">💼 Get Matched</h3>
            <p className="text-zinc-400">
              Discover relevant jobs based on your skills.
            </p>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="px-10 py-24">
        <h2 className="text-5xl font-bold text-center mb-16">What Users Say</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-900 p-8 rounded-3xl hover:scale-105 transition-all">
            <p className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</p>

            <p className="mt-4 text-zinc-300">
              Helped me improve my ATS score and get more interview calls.
            </p>

            <h4 className="mt-4 font-bold">Rahul Sharma</h4>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl hover:scale-105 transition-all">
            <p className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</p>

            <p className="mt-4 text-zinc-300">
              The AI feedback was extremely useful for improving my resume.
            </p>

            <h4 className="mt-4 font-bold">Priya Singh</h4>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl hover:scale-105 transition-all">
            <p className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</p>

            <p className="mt-4 text-zinc-300">
              Job match feature helped me find relevant opportunities.
            </p>

            <h4 className="mt-4 font-bold">Amit Verma</h4>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="text-center py-24 px-6">
        <h2 className="text-5xl font-bold">Ready to Improve Your Resume?</h2>

        <p className="text-zinc-400 mt-6 text-xl">
          Get ATS insights and AI-powered feedback instantly.
        </p>

        <button
          onClick={onGetStarted}
          className="mt-10 bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all"
        >
          Get Started
        </button>
      </section>
      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10 text-center text-zinc-500">
        <p>AI Resume Analyzer</p>

        <p className="mt-2">Built with React, Node.js, MongoDB & Gemini AI</p>
      </footer>
    </div>
  );
}

export default LandingPage;

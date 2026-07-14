import { FaFileAlt } from "react-icons/fa";
function Sidebar({ activeTab, setActiveTab, darkMode }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div
      className={`w-64 p-6 min-h-screen border-r ${
        darkMode
          ? "bg-zinc-900 border-zinc-800 text-white"
          : "bg-gray-100 border-gray-300 text-black"
      }`}
    >
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        Resume AI
      </h1>
      <p className="text-zinc-400 text-sm mt-2 mb-4">
        Welcome, {user?.username}
      </p>
      <div
        onClick={() => setActiveTab("dashboard")}
        className={`p-3 rounded-xl flex items-center gap-2 cursor-pointer ${
          activeTab === "dashboard" ? "bg-purple-600" : "hover:bg-zinc-800"
        }`}
      >
        <FaFileAlt />
        Dashboard
      </div>

      <div
        onClick={() => setActiveTab("analysis")}
        className={`p-3 rounded-xl cursor-pointer ${
          activeTab === "analysis" ? "bg-purple-600" : "hover:bg-zinc-800"
        }`}
      >
        Resume Analysis
      </div>

      <div
        onClick={() => setActiveTab("jobmatch")}
        className={`p-3 rounded-xl cursor-pointer ${
          activeTab === "jobs" ? "bg-purple-600" : "hover:bg-zinc-800"
        }`}
      >
        Job Match
      </div>
      <div
        onClick={() => setActiveTab("history")}
        className={`p-3 rounded-xl cursor-pointer ${
          activeTab === "history" ? "bg-purple-600" : "hover:bg-zinc-800"
        }`}
      >
        History
      </div>

      <div
        onClick={() => setActiveTab("settings")}
        className={`p-3 rounded-xl cursor-pointer ${
          activeTab === "settings" ? "bg-purple-600" : "hover:bg-zinc-800"
        }`}
      >
        Settings
      </div>
      <div
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          window.location.href = "/";
        }}
        className="p-3 rounded-xl cursor-pointer mt-5 bg-red-600 hover:bg-red-700"
      >
        Logout
      </div>
    </div>
  );
}

export default Sidebar;

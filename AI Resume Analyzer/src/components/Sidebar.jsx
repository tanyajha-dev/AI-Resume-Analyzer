import { FaFileAlt } from "react-icons/fa";
function Sidebar({ activeTab, setActiveTab })  {
  return (
    <div className="w-64 bg-zinc-900 p-6 border-r border-zinc-800 min-h-screen">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        Resume AI
      </h1>
      <div
onClick={() => setActiveTab("dashboard")}
className={`p-3 rounded-xl flex items-center gap-2 cursor-pointer ${
activeTab==="dashboard"
? "bg-purple-600"
: "hover:bg-zinc-800"
}`}
>
  <FaFileAlt />
  Dashboard
</div>

        <div
onClick={() => setActiveTab("analysis")}
className={`p-3 rounded-xl cursor-pointer ${
activeTab==="analysis"
? "bg-purple-600"
: "hover:bg-zinc-800"
}`}
>
Resume Analysis
</div>

        <div className="p-3 rounded-xl hover:bg-zinc-800 cursor-pointer">
          Job Match
        </div>

        <div className="p-3 rounded-xl hover:bg-zinc-800 cursor-pointer">
          History
        </div>
      </div>
    
  );
}

export default Sidebar;

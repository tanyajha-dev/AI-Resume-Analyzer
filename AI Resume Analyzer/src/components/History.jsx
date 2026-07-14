import { useEffect, useState } from "react";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    console.log("Logged User:", user);

    if (!user.id) {
      console.log("User ID not found");
      return;
    }

    fetch(`http://localhost:5000/history?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("History Data:", data);

        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          setHistory([]);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  const deleteHistory = async (id) => {
    try {
      await fetch(`http://localhost:5000/history/${id}`, {
        method: "DELETE",
      });

      setHistory(history.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 p-10">
      <h1 className="text-5xl font-bold">Analysis History</h1>

      <div className="mt-10 space-y-4">
        {history.map((item) => (
          <div key={item._id} className="bg-zinc-900 p-5 rounded-2xl">
            <h2 className="text-2xl font-bold">ATS Score: {item.atsScore}%</h2>

            <p className="mt-2">Skills: {item.skills?.join(", ")}</p>

            <p className="mt-2 text-zinc-400">
              {new Date(item.createdAt).toLocaleString()}
            </p>
            <button
              onClick={() => deleteHistory(item._id)}
              className="mt-4 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
            >
              🗑 Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;

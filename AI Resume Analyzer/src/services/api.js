export async function analyzeResume(resumeText) {
  console.log("API HIT");
  console.log(resumeText.substring(0, 100));

  try {
    const user = JSON.parse(localStorage.getItem("user"));

    console.log("API REQUEST SENT");

    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeText,
        userId: user?.id,
      }),
    });

    console.log("API RESPONSE RECEIVED");

    const data = await response.json();

    console.log("BACKEND RESPONSE:", data);

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

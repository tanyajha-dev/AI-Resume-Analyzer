export async function analyzeResume(resumeText) {

  try {

    const response = await fetch(
      "http://localhost:5000/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resumeText
        })
      }
    );

    const data = await response.json();

    return data;

  } catch (error) {

    console.log(error);

    return null;

  }

}
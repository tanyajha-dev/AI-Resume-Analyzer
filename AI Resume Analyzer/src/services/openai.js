import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function analyzeResume(text) {

  const response =
    await client.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [
        {
          role: "system",
          content:
            "You are an ATS resume analyzer.",
        },

        {
          role: "user",
          content:
            `Analyze this resume:\n${text}`,
        },
      ],
    });

  return response.choices[0].message.content;
}
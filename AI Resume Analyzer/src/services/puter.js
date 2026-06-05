import puter from "@heyputer/puter.js";

export async function askAI(prompt) {

  try {

    const response =
      await puter.ai.chat(prompt);

    return response;

  } catch (error) {

    console.log(error);

  }
}
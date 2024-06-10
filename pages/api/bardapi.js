const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = 'AIzaSyBlCDikVqFYvBto7kEvpVHaLgd2x7eS-Gg'; // Directly include the API key in the code (not recommended for production)

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

export default async function handler(req, res) {
  const userMessage = req.query.ques;
  if (!userMessage) {
    return res.status(400).json({ error: 'Query parameter "ques" is required' });
  }

  let messages = [{ content: userMessage }];

  try {
    const result = await client.generateMessage({
      model: MODEL_NAME,
      temperature: 0.25,
      candidateCount: 1,
      top_k: 40,
      top_p: 0.95,
      prompt: {
        messages: messages,
      },
    });

    const responseContent = result[0].candidates[0]?.content || "No response generated";
    console.log("First Response:", responseContent);

    res.status(200).json({ response: responseContent });
  } catch (error) {
    console.error("Error generating message:", error);
    res.status(500).json({ error: "Failed to generate message" });
  }
}

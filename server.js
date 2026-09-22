const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", function (req, res) {
  res.json({
    status: "online",
    message: "🐼 Panda AI Backend is running!"
  });
});

app.post("/api/chat", async function (req, res) {
  try {
    const question = req.body.question || "";
    const profile = req.body.profile || {};

    if (!question.trim()) {
      return res.status(400).json({
        error: "Question is required."
      });
    }

    const instructions =
      "You are Panda AI Tutor, a friendly AI study buddy. " +
      "Help students learn clearly and safely. " +
      "Adapt explanations to the student's class and board. " +
      "For mathematics, show the steps clearly. " +
      "Use simple language when appropriate. " +
      "Do not pretend to be a human teacher.";

    const studentInfo =
      "Student profile: " +
      "Class: " + (profile.className || "Not provided") +
      ", Board: " + (profile.board || "Not provided") +
      ", Exam month: " + (profile.examMonth || "Not provided") +
      ", Average score: " + (profile.averageScore || "Not provided") +
      ", Study time: " + (profile.studyTime || "Not provided") +
      ", Daily goal: " + (profile.dailyGoal || "Not provided");

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions: instructions + "\n" + studentInfo,
      input: question
    });

    res.json({
      answer: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Panda could not answer right now."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log("🐼 Panda AI Backend running on port " + PORT);
});

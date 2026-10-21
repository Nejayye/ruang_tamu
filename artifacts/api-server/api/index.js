const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Server Active" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/contact", async (req, res) => {
  const { name, message } = req.body || {};

  if (!name || !name.trim() || !message || !message.trim()) {
    return res.status(400).json({ error: "Name and message are required." });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK env var is not set");
    return res.status(500).json({ error: "Webhook not configured." });
  }

  const payload = {
    username: "kidu",
    embeds: [
      {
        title: "📩 New Hate Message",
        color: 0xcc00cc,
        fields: [
          { name: "From", value: name, inline: true },
          { name: "Message", value: message }
        ],
        footer: { text: "Sent via Tourist Message" },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      console.error("Discord error:", errText);
      return res.status(500).json({ error: "Failed to send message to Discord." });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = app;
import express, { type Express } from "express";
import cors from "cors";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: any, res: any) => {
  res.json({ message: "API Server Active" });
});

app.get("/health", (req: any, res: any) => {
  res.json({ status: "ok" });
});

app.post("/contact", async (req: any, res: any) => {
  const { name, message } = req.body as { name?: string; message?: string };

  if (!name?.trim() || !message?.trim()) {
    res.status(400).json({ error: "Name and message are required." });
    return;
  }

  const webhookUrl = process.env["DISCORD_WEBHOOK_URL"];
  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK env var is not set");
    res.status(500).json({ error: "Webhook not configured." });
    return;
  }

  const domain = process.env["REPLIT_DOMAINS"]?.split(",")[0];
  const avatarUrl = domain ? `https://${domain}/gif4.gif` : "https://i.imgur.com/4M34hi2.png";

  const payload = {
    username: "Ren",
    avatar_url: avatarUrl,
    embeds: [
      {
        title: "📩 New Calling Card",
        color: 0xcc00cc,
        fields: [
          { name: "From", value: name, inline: true },
          { name: "Message", value: message },
        ],
        footer: { text: "Sent via Tourist Message" },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const discordRes: any = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      console.error({ status: discordRes.status, error: errText }, "Discord webhook failed");
      res.status(500).json({ error: "Failed to send message to Discord." });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default app;
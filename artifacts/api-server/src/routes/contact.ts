import { Router } from "express";

const contactRouter = Router();

contactRouter.post("/contact", async (req, res) => {
  const { name, message } = req.body as { name?: string; message?: string };

  if (!name?.trim() || !message?.trim()) {
    res.status(400).json({ error: "Name and message are required." });
    return;
  }

  const webhookUrl = process.env["DISCORD_WEBHOOK_URL"];
  if (!webhookUrl) {
    req.log.error("DISCORD_WEBHOOK env var is not set");
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
        footer: { text: "Sent Via Tourist Message" },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const discordRes = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!discordRes.ok) {
    const text = await discordRes.text();
    req.log.error({ status: discordRes.status, body: text }, "Discord webhook failed");
    res.status(502).json({ error: "Discord delivery failed." });
    return;
  }

  res.json({ ok: true });
});

export default contactRouter;

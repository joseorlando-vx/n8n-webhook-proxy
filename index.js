const express = require("express");
const axios = require("axios");

const GROUP_JID = process.env.GROUP_JID;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const PORT = process.env.PORT || 3000;

if (!GROUP_JID || !N8N_WEBHOOK_URL) {
  console.error("Defina GROUP_JID e N8N_WEBHOOK_URL (veja .env.example).");
  process.exit(1);
}

const app = express();
app.use(express.json({ limit: "10mb" }));

app.post("/webhook", async (req, res) => {
  // Responde imediatamente para a Evolution API não dar timeout
  res.status(200).json({ status: "ok" });

  try {
    const body = req.body;
    const remoteJid = body?.data?.key?.remoteJid || "";

    // Só repassa se for do grupo configurado
    if (remoteJid !== GROUP_JID) {
      console.log(`[BLOCKED] remoteJid: ${remoteJid}`);
      return;
    }

    console.log(`[FORWARDED] remoteJid: ${remoteJid}`);

    await axios.post(N8N_WEBHOOK_URL, body, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
  } catch (err) {
    console.error("[ERROR]", err.message);
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Proxy rodando na porta ${PORT}`);
});

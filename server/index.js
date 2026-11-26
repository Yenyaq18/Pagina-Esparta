import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const ENDPOINT = process.env.AZURE_AI_PROJECT_ENDPOINT;
const AGENT_NAME = process.env.AZURE_AI_AGENT_NAME || "Agente-Academia-Esparta";
const FALLBACK = "No pude procesar tu consulta en este momento. Inténtalo nuevamente en unos segundos.";

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "20kb" }));

// ---- Cliente de Azure AI Foundry (una sola vez) ----
let openAI = null;
async function getClient() {
  if (openAI) return openAI;
  if (!ENDPOINT) throw new Error("Falta AZURE_AI_PROJECT_ENDPOINT");
  const project = new AIProjectClient(ENDPOINT, new DefaultAzureCredential());
  openAI = await project.getOpenAIClient();
  return openAI;
}

app.get("/api/health", (_req, res) => res.json({ ok: true, agent: AGENT_NAME }));

const limiter = rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: true, legacyHeaders: false,
  message: { error: "Demasiadas consultas. Espera un minuto e inténtalo de nuevo." } });

app.post("/api/chat", limiter, async (req, res) => {
  const message = String(req.body?.message ?? "").trim();
  if (!message) return res.status(400).json({ error: "Escribe un mensaje." });
  if (message.length > 1000) return res.status(400).json({ error: "El mensaje es demasiado largo (máx. 1000 caracteres)." });

  try {
    const client = await getClient();
    let conversationId = req.body?.conversationId;
    if (!conversationId) {
      const conv = await client.conversations.create({});
      conversationId = conv.id;
    }
    const response = await client.responses.create(
      { conversation: conversationId, input: message },
      { body: { agent_reference: { name: AGENT_NAME, type: "agent_reference" } } }
    );
    res.json({ reply: response.output_text || FALLBACK, conversationId });
  } catch (err) {
    console.error("Error al consultar el agente:", err?.message || err);
    res.status(502).json({ error: FALLBACK });
  }
});

// ---- Frontend compilado ----
const dist = path.join(__dirname, "..", "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => console.log(`Servidor listo en http://localhost:${PORT}`));

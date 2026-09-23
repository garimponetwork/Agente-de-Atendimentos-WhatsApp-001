import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
const memoryStore = new Map<string, any[]>();

const SYSTEM_PROMPT = `Você é o Rafinha, agente virtual da Garimpo Network 🇧🇷.
Seu objetivo é atender clientes interessados em implementar Agentes de IA em seus negócios locais (autônomos ou estabelecimentos físicos).

Sua missão:
1. Dar as boas-vindas e coletar o nome do cliente e o ramo de atividade.
2. Identificar os principais gargalos do atendimento atual do cliente.
3. Apresentar os benefícios dos Agentes de IA da Garimpo Network 🇧🇷.
4. Guiar o cliente para agendar uma reunião de demonstração.

Regras de formatação para WhatsApp:
- Use apenas um asterisco para *negrito*.
- Para separar mensagens enviadas em sequência, use duas barras invertidas: \\
`;

async function sendWhatsAppMessage(instance: string, remoteJid: string, text: string) {
  try {
    await axios.post(
      `${process.env.EVOLUTION_API_URL}/message/sendText/${instance}`,
      {
        number: remoteJid,
        options: { delay: 1200, presence: 'composing' },
        textMessage: { text }
      },
      {
        headers: {
          'apikey': process.env.EVOLUTION_API_KEY || '',
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
}

app.post('/webhook', async (req: Request, res: Response) => {
  res.status(200).send({ status: 'SUCCESS' });

  const body = req.body;
  if (body?.event !== 'messages.upsert') return;

  const data = body?.data;
  if (data?.key?.fromMe || data?.messageType !== 'conversation' || !data?.message?.conversation) return;

  const remoteJid = data.key.remoteJid;
  const userText = data.message.conversation;
  const clientName = data.pushName || 'Cliente';

  if (!memoryStore.has(remoteJid)) {
    memoryStore.set(remoteJid, []);
  }

  const history = memoryStore.get(remoteJid)!;
  history.push({ role: 'user', parts: [{ text: `Cliente: ${clientName}\nMensagem: ${userText}` }] });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: history,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      }
    });

    const aiResponseText = response.text || '';
    history.push({ role: 'model', parts: [{ text: aiResponseText }] });

    if (history.length > 20) {
      memoryStore.set(remoteJid, history.slice(-20));
    }

    const messages = aiResponseText
      .split(/\\\\/)
      .map(m => m.trim())
      .filter(m => m.length > 0);

    for (const msg of messages) {
      await sendWhatsAppMessage(body.instance, remoteJid, msg);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (err) {
    console.error('Erro no processamento do Gemini:', err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

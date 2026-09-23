import express, { Request, Response } from 'express';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RAFINHA_PROMPT } from './prompts/rafinha_garimpo';

const app = express();
app.use(express.json());

// Inicialização das variáveis de ambiente
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || '';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '';

// Configuração do Google Gemini 1.5 Flash com a System Instruction do Rafinha
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: RAFINHA_PROMPT,
});

// Rota do Webhook da Evolution API
app.post('/webhook', async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Processa apenas mensagens enviadas por utilizadores (MESSAGES_UPSERT)
    if (data.event === 'messages.upsert' && !data.data.key.fromMe) {
      const remoteJid = data.data.key.remoteJid;
      const instance = data.instance;

      // Extrai o texto da mensagem
      const userMessage =
        data.data.message?.conversation ||
        data.data.message?.extendedTextMessage?.text ||
        '';

      if (userMessage) {
        console.log(`[Mensagem Recebida de ${remoteJid}]: ${userMessage}`);

        // Envia o texto da mensagem para o Gemini gerar a resposta
        const result = await model.generateContent(userMessage);
        const responseText = result.response.text();

        console.log(`[Resposta do Rafinha]: ${responseText}`);

        // Envia a resposta de volta ao utilizador através da Evolution API
        await axios.post(
          `${EVOLUTION_API_URL}/message/sendText/${instance}`,
          {
            number: remoteJid,
            options: {
              delay: 1200,
              presence: 'composing',
            },
            text: responseText,
          },
          {
            headers: {
              apikey: EVOLUTION_API_KEY,
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }

    return res.status(200).json({ status: 'SUCCESS' });
  } catch (error) {
    console.error('Erro ao processar o webhook:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Porta padrão do Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// src/server.ts - Adição do suporte Multimodal (Áudio e Imagem)
import express, { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from './config/database';

const app = express();
app.use(express.json({ limit: '20mb' })); // Limite expandido para suportar mídias

const PORT = process.env.PORT || 10000;

app.post('/webhook', async (req: Request, res: Response) => {
  try {
    const { event, instance, data } = req.body;

    if (event !== 'messages.upsert' || !data || !data.key) {
      return res.status(200).json({ status: 'ignored' });
    }

    const remoteJid = data.key.remoteJid || '';
    if (remoteJid.endsWith('@g.us')) return res.status(200).json({ status: 'ignored_group' });

    // 1. Extração da mensagem (Texto, Imagem ou Áudio)
    const messageContent = data.message;
    let parts: any[] = [];

    // Se for texto simples
    if (messageContent?.conversation || messageContent?.extendedTextMessage?.text) {
      const text = messageContent.conversation || messageContent.extendedTextMessage.text;
      parts.push(text);
    }

    // Se for Imagem (Multimodal Vision)
    if (messageContent?.imageMessage) {
      const imageBase64 = data.body?.media || messageContent.imageMessage.base64; 
      const caption = messageContent.imageMessage.caption || 'Analise esta imagem e me explique de forma simples.';
      
      if (imageBase64) {
        parts.push({
          inlineData: {
            data: imageBase64,
            mimeType: messageContent.imageMessage.mimetype || 'image/jpeg'
          }
        });
      }
      parts.push(caption);
    }

    // Se for Áudio (Multimodal Audio Transcription)
    if (messageContent?.audioMessage) {
      const audioBase64 = data.body?.media || messageContent.audioMessage.base64;
      
      if (audioBase64) {
        parts.push({
          inlineData: {
            data: audioBase64,
            mimeType: messageContent.audioMessage.mimetype || 'audio/ogg; codecs=opus'
          }
        });
        parts.push('Escute este áudio do usuário, entenda o que ele precisa e responda de forma simples, clara e acolhedora.');
      }
    }

    if (parts.length === 0) {
      return res.status(200).json({ status: 'unsupported_media_type' });
    }

    // 2. Buscar Agente e Ofertas no Postgres
    const agentQuery = await db.query('SELECT * FROM agentes WHERE instance_name = $1 AND is_active = true', [instance]);
    if (agentQuery.rows.length === 0) return res.status(404).json({ error: 'Agente inativo' });

    const agente = agentQuery.rows[0];

    // Instrução de acessibilidade injetada no System Prompt
    const accessibilityPrompt = `\n\n--- REGRAS DE ACESSIBILIDADE E LINGUAGEM ---
- Responda de forma simples, humana e muito direta.
- Evite palavras difíceis ou termos técnicos.
- Se o usuário enviou áudio ou imagem, ajude-o com paciência tirando suas dúvidas.`;

    const genAI = new GoogleGenerativeAI(agente.gemini_api_key || process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: agente.system_prompt + accessibilityPrompt
    });

    // 3. Processamento Multimodal no Gemini
    const result = await model.generateContent(parts);
    const replyText = result.response.text();

    // 4. Envio de resposta via Evolution API
    const evolutionUrl = process.env.EVOLUTION_API_URL;
    const evolutionToken = process.env.EVOLUTION_API_TOKEN;

    if (evolutionUrl && evolutionToken) {
      await fetch(`${evolutionUrl}/message/sendText/${instance}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': evolutionToken },
        body: JSON.stringify({
          number: remoteJid.replace('@s.whatsapp.net', ''),
          options: { delay: 1200, presence: 'composing' },
          textMessage: { text: replyText }
        })
      });
    }

    return res.status(200).json({ status: 'success', reply: replyText });

  } catch (error) {
    console.error('Erro no processamento multimodal:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

# Agente-de-Atendimentos-WhatsApp-001
Agente de IA autônomo (Rafinha) para atendimento, triagem e agendamento de serviços de implementação de IA no mercado local (Garimpo Network 🇧🇷).

# Agente de Atendimento e Vendas WhatsApp — Rafinha (Garimpo Network 🇧🇷)

## Descrição
Aplicação Node.js em TypeScript para atendimento, triagem e agendamento de clientes interessados em implementação de Agentes de IA no mercado local (autônomos e estabelecimentos físicos).

## Arquitetura do Sistema
- **Webhook Engine:** Express.js tratando eventos do WhatsApp (`messages.upsert`) vindos da Evolution API.
- **Modelo de IA:** SDK oficial do Google Gen AI (`@google/genai`) usando `gemini-2.5-flash`.
- **Memória de Sessão:** Gerenciamento em memória por número de telefone (`remoteJid`).
- **Prompt Base:** Arquivo `prompt-agente.md`.

## Como Executar
1. `npm install`
2. Configurar variáveis `.env`: `GEMINI_API_KEY`, `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`.
3. `npm run dev`


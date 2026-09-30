# Agente de Atendimentos WhatsApp Multi-Agente (Rafinha)

Sistema robusto, leve e de alta performance para atendimento automatizado no WhatsApp, integrado ao **Google Gemini API** (`gemini-2.5-flash`), **Evolution API**, banco de dados **PostgreSQL** e suporte a **Acessibilidade Multimodal**.

---

## 🏗️ Arquitetura da Infraestrutura

O projeto está estruturado no formato **Monorepo** para manter a separação clara entre a API do agente, a base de dados, a documentação técnica e o futuro painel administrativo.

```text
.
├── src/                    # Servidor Node.js/Express (Processamento da API)
│   ├── config/             # Configurações de conexões e integrações
│   │   └── database.ts     # Conexão com o PostgreSQL (pg-pool)
│   ├── agentes/            # Módulos e prompts dos agentes
│   └── server.ts           # Servidor principal e Webhook
├── apps/
│   └── dashboard/          # Painel Administrativo Web (React/Vite - Em dev)
│       └── README.md
├── database/
│   └── schema.sql          # Schemas e migrações SQL para o PostgreSQL
├── docs/
│   └── ARCHITECTURE.md     # Documentação técnica e rotas da API
├── .gitignore
├── LICENSE
├── README.md               # Visão geral do repositório
├── package.json
└── tsconfig.json

🚀 Tecnologias Utilizadas
Motor de IA: Google Gemini API (@google/generative-ai - modelo gemini-2.5-flash)
Backend / API: Node.js com TypeScript e Express
Integração WhatsApp: Evolution API
Banco de Dados: PostgreSQL (hospedado no Railway / Render)
Hospedagem da API: Render (apps/api)
Versionamento: GitHub

🔥 Funcionalidades Principais
Gestão Dinâmica de Agentes (Multi-Tenancy):
Prompts de persona, chaves de Gemini API e status de ativação carregados diretamente do banco de dados PostgreSQL.
Filtro Inteligente Anti-Spam e Grupos:
Bloqueio automático em mensagens de grupos de WhatsApp (@g.us).
Validação por palavras-chave (SPAM/PYRAMIDS) para barrar ofertas de invasão e spam.
Injeção de Ofertas em Tempo Real:
Consulta a tabela de produtos/ofertas no banco e injeta automaticamente no contexto das conversas.
Simulação de Presença Humana:
Envio de status "digitando..." (composing) e delay configurado de 1.2s para humanização da experiência.
Acessibilidade Multimodal & Inclusão Social (Áudio, Visão e Linguagem Clara):
Processamento de Áudio: Transcrição e interpretação nativa de mensagens de voz enviadas por usuários com baixa escolaridade ou limitações de escrita.
Visão Computacional (OCR): Leitura de fotos de documentos, produtos ou comprovantes enviados pelos clientes.
Linguagem Simplificada: Instruções de sistema focadas em respostas acolhedoras, objetivas e sem jargões difíceis.
Captura de Leads para E-mail Marketing:
Estrutura para identificação e salvamento de e-mails de clientes na base de dados.

⚙️ Configuração de Variáveis de Ambiente (.env)
Para o correto funcionamento do servidor em src/server.ts, configure as seguintes variáveis no ambiente:

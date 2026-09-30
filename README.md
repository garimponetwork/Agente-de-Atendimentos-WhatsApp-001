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

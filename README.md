# Agente de Atendimentos WhatsApp Multi-Agente (Rafinha)

Sistema robusto, leve e de alta performance para atendimento automatizado no WhatsApp, integrado ao **Google Gemini API** (`gemini-2.5-flash`), **Evolution API** e banco de dados **PostgreSQL**.

---

## 🏗️ Arquitetura da Infraestrutura

O projeto está estruturado no formato **Monorepo** para manter a separação clara entre a API do agente, a base de dados e o futuro painel administrativo.

```text
.
├── apps/
│   ├── api/            # Servidor Node.js/Express (Processamento do Webhook e Gemini API)
│   └── dashboard/      # Painel Administrativo Web (React/Vite)
├── database/           # Schemas e migrações SQL para o PostgreSQL
├── docs/               # Documentação técnica e rotas de API
└── README.md           # Visão geral do repositório

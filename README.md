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

⚡ Tecnologias Utilizadas
​Motor de IA: Google Gemini API (@google/generative-ai - modelo gemini-2.5-flash)
​Backend / API: Node.js com TypeScript e Express
​WhatsApp Integration: Evolution API (hospedada no Railway)
​Banco de Dados: PostgreSQL (hospedado no Railway / Render)
​Hospedagem da API: Render (apps/api)
​Versionamento: GitHub

​🚀 Funcionalidades Principais
​Gestão Dinâmica de Agentes (Multi-Tenancy):
​Prompts de persona, chaves da Gemini API e status de ativação carregados dinamicamente do PostgreSQL com base no instanceName da Evolution API.
​Filtro Inteligente Anti-Spam e Grupos:
​Bloqueio automático de mensagens de grupos do WhatsApp (@g.us).
​Validação por palavras-chave (SPAM_KEYWORDS) para barrar ofertas de empréstimos, consignados e crédito não solicitados.
​Injeção de Ofertas em Tempo Real:
​Consulta a tabela produtos_ofertas no banco e injeta automaticamente as ofertas ativas no contexto do Gemini a cada atendimento.
​Simulação de Presença Humana:
​Envio do status "digitando..." (composing) e delay configurado de 1200ms antes do envio das respostas via Evolution API.
​Captura de Leads para E-mail Marketing:
​Estrutura para identificação e salvamento de e-mails de clientes na tabela leads para campanhas e ofertas semanais.

​🛠️ Configuração de Variáveis de Ambiente (.env)
​Para o correto funcionamento do servidor em apps/api, configure as seguintes variáveis no serviço do Render:

VariávelDescrição
DATABASE_URLURI de conexão direta com o PostgreSQL no Railway/Render
GEMINI_API_KEYChave global de fallback para a API do Google Gemini
EVOLUTION_API_URLURL base da sua instância da Evolution API no Railway
EVOLUTION_API_TOKENChave Global / API Key de autenticação da Evolution API
PORTPorta de execução do servidor Express (Padrão: 10000)


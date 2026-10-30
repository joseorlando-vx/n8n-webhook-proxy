# n8n-webhook-proxy

Pequeno proxy em Node.js que fica entre a **Evolution API** (WhatsApp) e um **webhook do n8n** e repassa apenas as mensagens de um grupo específico. O restante é descartado antes de chegar ao n8n, evitando execuções desnecessárias do workflow.

## O problema

A Evolution API envia ao webhook **todos** os eventos da instância. Cada evento disparava uma execução no n8n, mesmo quando a mensagem não era do grupo de interesse. Isso gastava execuções do plano e poluía o histórico.

## A solução

O proxy recebe o webhook, responde `200` imediatamente (para a Evolution API não dar timeout), compara o `remoteJid` com o grupo configurado e só então encaminha o corpo para o n8n.

```
Evolution API --> proxy (filtra por remoteJid) --> n8n webhook
                     \--> descarta o restante
```

## Stack

Node.js 18+, Express, Axios.

## Como rodar

```bash
npm install
cp .env.example .env   # preencha GROUP_JID e N8N_WEBHOOK_URL
export $(grep -v '^#' .env | xargs)
npm start
```

Aponte o webhook da instância na Evolution API para `POST http://<host>:3000/webhook`.

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `GROUP_JID` | JID do grupo permitido (obrigatória) |
| `N8N_WEBHOOK_URL` | URL do webhook no n8n (obrigatória) |
| `PORT` | Porta do servidor (padrão `3000`) |

## Endpoints

- `POST /webhook`: recebe eventos da Evolution API
- `GET /health`: verificação de saúde

## Licença

MIT

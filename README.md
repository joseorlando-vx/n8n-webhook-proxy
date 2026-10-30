# n8n-webhook-proxy

A small Node.js proxy that sits between the **Evolution API** (WhatsApp) and an **n8n webhook** and forwards only the messages from one specific group. Everything else is dropped before it reaches n8n, avoiding unnecessary workflow executions.

## The problem

The Evolution API sends **every** event of an instance to the webhook. Each event triggered an n8n execution, even when the message was not from the group of interest. That used up plan executions and cluttered the execution history.

## The solution

The proxy receives the webhook, answers `200` immediately (so the Evolution API does not time out), compares the `remoteJid` with the configured group and only then forwards the body to n8n.

```
Evolution API --> proxy (filters by remoteJid) --> n8n webhook
                     \--> drops everything else
```

## Stack

Node.js 18+, Express, Axios.

## How to run

```bash
npm install
cp .env.example .env   # fill in GROUP_JID and N8N_WEBHOOK_URL
export $(grep -v '^#' .env | xargs)
npm start
```

Point the instance webhook in the Evolution API to `POST http://<host>:3000/webhook`.

## Environment variables

| Variable | Description |
|---|---|
| `GROUP_JID` | JID of the allowed group (required) |
| `N8N_WEBHOOK_URL` | Webhook URL in n8n (required) |
| `PORT` | Server port (default `3000`) |

## Endpoints

- `POST /webhook`: receives events from the Evolution API
- `GET /health`: health check

## License

MIT

# 🤖 JavaScript Discord Bot (discord.js v14)

Bot para Discord desenvolvido em **JavaScript (Node.js)** utilizando **discord.js v14** com suporte nativo a **Slash Commands** (`/ping`) e pronto para deploy na **Discloud** ou execução local.

---

## ⚡ Comandos Disponíveis

- `/ping`: Responde com métricas detalhadas de latência de ida e volta, ping da WebSocket API do Discord e tempo de atividade (uptime).

---

## 🚀 Como Configurar e Executar

### 1. Criar Aplicação no Discord Developer Portal
1. Acesse o [Discord Developer Portal](https://discord.com/developers/applications).
2. Clique em **New Application** e defina um nome para o bot.
3. No menu lateral **Bot**, clique em **Reset Token** e copie o seu token.
4. No menu lateral **OAuth2** -> **URL Generator**, selecione os escopos `bot` e `applications.commands`.
5. Cole a URL gerada no navegador para convidar o bot ao seu servidor.

### 2. Configurar o Arquivo `.env`
Copie o template e preencha com suas credenciais:
```bash
cp .env.example .env
```

```env
DISCORD_TOKEN=seu_bot_token_aqui
CLIENT_ID=seu_client_id_aqui
GUILD_ID=opcional_id_do_servidor_para_registro_imediato
```

### 3. Instalar Dependências e Iniciar
```bash
npm install
npm start
```

---

## ☁️ Deploy na Discloud

O projeto inclui o arquivo `discloud.config` pronto:
```ini
NAME=javascript-bot
TYPE=bot
MAIN=index.js
RAM=100
AUTORESTART=false
VERSION=latest
APT=tools
```

Para hospedar na Discloud:
1. Compacte os arquivos (`index.js`, `package.json`, `discloud.config`) em um arquivo `.zip`.
2. Faça o upload pelo site ou use a CLI da Discloud.

import { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  SlashCommandBuilder, 
  EmbedBuilder 
} from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN) {
  console.error("❌ ERRO: DISCORD_TOKEN não foi informado no arquivo .env");
  console.log("👉 Adicione o token no .env e tente novamente.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Definição dos Slash Commands
const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responde com Pong e exibe as métricas de latência do bot!")
    .toJSON()
];

// Registro dos Slash Commands na API do Discord
async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(TOKEN);
  try {
    console.log("🔄 Registrando Slash Commands (/ping)...");
    
    if (GUILD_ID && CLIENT_ID) {
      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
      );
      console.log(`✅ Slash Commands registrados com sucesso no servidor [${GUILD_ID}]!`);
    } else if (CLIENT_ID) {
      await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands }
      );
      console.log("✅ Slash Commands registrados globalmente!");
    } else {
      console.log("⚠️ AVISO: CLIENT_ID não definido no .env. O bot tentará registrar após o login.");
    }
  } catch (error) {
    console.error("❌ Erro ao registrar Slash Commands:", error);
  }
}

// Evento: Bot conectado
client.once("ready", async () => {
  console.log("==================================================");
  console.log(`🤖 Bot Conectado: ${client.user.tag}`);
  console.log(`⚡ Framework:     Discord.js v14 (JavaScript)`);
  console.log(`📡 Servidores:    ${client.guilds.cache.size}`);
  console.log("==================================================");

  // Se CLIENT_ID não estava no .env, registra usando o ID do próprio bot
  if (!CLIENT_ID && client.user?.id) {
    const rest = new REST({ version: "10" }).setToken(TOKEN);
    try {
      if (GUILD_ID) {
        await rest.put(Routes.applicationGuildCommands(client.user.id, GUILD_ID), { body: commands });
      } else {
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
      }
      console.log("✅ Slash Commands registrados automaticamente usando o ID do bot!");
    } catch (e) {
      console.error("Erro no auto-registro de comandos:", e);
    }
  }
});

// Evento: Interação de Slash Command
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    const sent = await interaction.reply({ 
      content: "🏓 Calculando latência...", 
      fetchReply: true 
    });

    const roundtripLatency = sent.createdTimestamp - interaction.createdTimestamp;
    const wsPing = client.ws.ping;
    const uptimeMinutes = Math.floor(process.uptime() / 60);
    const uptimeSeconds = Math.floor(process.uptime() % 60);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("🏓 Pong! Estatísticas do Bot")
      .setDescription("Bot em execução com sucesso via Slash Commands!")
      .addFields(
        { name: "⚡ Latência de Ida e Volta", value: `\`${roundtripLatency}ms\``, inline: true },
        { name: "📡 Ping WebSocket API", value: `\`${wsPing}ms\``, inline: true },
        { name: "⏱️ Tempo Ativo (Uptime)", value: `\`${uptimeMinutes}m ${uptimeSeconds}s\``, inline: true },
        { name: "📦 Framework", value: "`Discord.js v14 (Node.js)`", inline: true },
        { name: "🟢 Status", value: "`Online & Operacional`", inline: true }
      )
      .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.editReply({ content: "", embeds: [embed] });
  }
});

// Inicia o bot e registra comandos
registerCommands().then(() => {
  client.login(TOKEN);
});

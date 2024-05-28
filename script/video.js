const yts = require('yt-search');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "video",
  version: "1.0",
  hasPermssion: 0,
  description: "Play a music video",
  commandCategory: "media",
  usages: "video [title]",
  cooldowns: 15,
  credits: "Adapted from original by octobot",//mod by chilli
};

module.exports.run = async function ({ api, event, args }) {
  const { sendMessage: reply } = api;
  const videoName = args.join(' ');

  if (!videoName) {
    reply(`To get started, type "video" followed by the title of the video you want to play.`, event.threadID, event.messageID);
    return;
  }

  try {
    reply(`Searching for "${videoName}"...`, event.threadID, event.messageID);

    const searchResults = await yts(videoName);

    if (!searchResults.videos.length) {
      return reply("Can't find the video you searched for.", event.threadID, event.messageID);
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;

    const videoPath = path.resolve(__dirname, 'video.mp4');

    // Download the video using ytdl-core or any other video downloading module
    const ytdl = require('ytdl-core');
    ytdl(videoUrl, { quality: 'highestvideo' })
      .pipe(fs.createWriteStream(videoPath))
      .on('finish', () => {
        // Send the video file
        const message = {
          body: `${video.title}`,
          attachment: fs.createReadStream(videoPath)
        };

        reply(message, event.threadID, () => {
          // Delete the video file after sending
          fs.unlinkSync(videoPath);
        });
      })
      .on('error', (error) => {
        console.error(error);
        reply('An error occurred while processing your request.', event.threadID, event.messageID);
      });

  } catch (error) {
    console.error(error);
    reply('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};

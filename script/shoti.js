const axios = require('axios');
const fs = require('fs');
const path = require('path');
const request = require('request');

module.exports.config = {
  name: "shoti",
  version: "1.0.0",
};

module.exports.run = async function ({ api, event, args }) {
  try {
    var msg1 = {
      body: "Sending Babes...😘"
    };

    const apiUrl = "https://your-shoti-api.vercel.app/api/v1/get";

    // Make a POST request
    const { data } = await axios.post(apiUrl, {
      apikey: "$shoti-1hkangh72bobl1qvrug",
    });

    // Destructure relevant information from the response data
    const { url: videoUrl, user: { username, nickname } } = data.data;
   
    // Create a folder named "cache" if it doesn't exist
    const cacheFolder = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheFolder)) {
      fs.mkdirSync(cacheFolder);
    }

    // Create a writable stream to save the video locally with a timestamp
    const timestamp = new Date().getTime(); // Get current timestamp
    const videoFilename = `${timestamp}video.mp4`; // Construct filename with timestamp
    const videoPath = path.join(cacheFolder, videoFilename);
    const videoStream = fs.createWriteStream(videoPath);

    // Download the video using the 'request' library
    await new Promise((resolve, reject) => {
      const rqs = request(encodeURI(videoUrl));
      rqs.pipe(videoStream);

      rqs.on('end', resolve);
      rqs.on('error', reject);
    });

    // Include the local video file as an attachment
    var msg2 = {
      body: `ToktikUser: ${username} (${nickname})`,
      attachment: fs.createReadStream(videoPath)
    };

    // Send the first message
    api.sendMessage(msg1, event.threadID, event.messageID);

    // Introduce a delay of 2 seconds before sending the second message
    setTimeout(() => {
      api.sendMessage(msg2, event.threadID, event.messageID);
    }, 2000);

  } catch (error) {
    console.error(error);
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
const fs = require("fs");
const moment = require("moment-timezone");
const request = require("request");

module.exports.config = {
		name: "info",
		version: "1.0.1",
		aliases: ["info", "Info", "in", "fo"],
		role: 0,
		credits: "cliff",
		description: "Admin and Bot info.",
		cooldown: 5,
		hasPrefix: false,
};

module.exports.run = async function({ api, event, args }) {
		let time = process.uptime();
		let years = Math.floor(time / (60 * 60 * 24 * 365));
		let months = Math.floor((time % (60 * 60 * 24 * 365)) / (60 * 60 * 24 * 30));
		let days = Math.floor((time % (60 * 60 * 24 * 30)) / (60 * 60 * 24));
		let weeks = Math.floor(days / 7);
		let hours = Math.floor((time % (60 * 60 * 24)) / (60 * 60));
		let minutes = Math.floor((time % (60 * 60)) / 60);
		let seconds = Math.floor(time % 60);
		const uptimeString = `${years > 0 ? `${years} years ` : ''}${months > 0 ? `${months} months ` : ''}${weeks > 0 ? `${weeks} weeks ` : ''}${days % 7 > 0 ? `${days % 7} days ` : ''}${hours > 0 ? `${hours} hours ` : ''}${minutes > 0 ? `${minutes} minutes ` : ''}${seconds} seconds`;

		const prefix = "+";
		const CREATORLINK = "https://www.facebook.com/61550264923277";
		const BOTCREATOR = "AJ CHICANO";
		const BOTNAME = "BOTIBOT";
		const FILESOWNER = "";
		const juswa = moment.tz("Asia/Manila").format("『D/MM/YYYY』 【HH:mm:ss】");
		const link = ["https://i.imgur.com/9LDVC57.mp4", "https://i.imgur.com/r7IxgiR.mp4", "https://i.imgur.com/J1jWubu.mp4", "https://i.imgur.com/DJylTiy.mp4", "https://i.imgur.com/v4mLGte.mp4", "https://i.imgur.com/uthREbe.mp4", "https://i.imgur.com/ee8fHna.mp4", "https://i.imgur.com/VffzOwS.mp4", "https://i.imgur.com/ci5nztg.mp4", "https://i.imgur.com/qHPeKDV.mp4", "https://i.imgur.com/Rkl5UmH.mp4"];

		const callback = () => {
				api.sendMessage({
						body: `➢ Admin and Bot Information

⁂ Bot Name: ${BOTNAME}
✧ Bot Admin: ${BOTCREATOR}
♛ Bot Admin Link: ${CREATORLINK}
❂ Bot Prefix: ${prefix}
➟ UPTIME ${uptimeString}
✬ Today is: ${juswa} 

➳ Bot is running ${hours}:${minutes}:${seconds}.
✫ Thanks for using my bot`,
						attachment: fs.createReadStream(__dirname + "/cache/owner_video.mp4")
				}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/owner_video.mp4"));
		};

		const linkIndex = Math.floor(Math.random() * link.length);
		request(encodeURI(link[linkIndex]))
				.on('error', (err) => {
						console.error('Error downloading video:', err);
						api.sendMessage('An error occurred while processing the command.', event.threadID, null, event.messageID);
				})
				.pipe(fs.createWriteStream(__dirname + "/cache/owner_video.mp4"))
				.on("close", callback);
};

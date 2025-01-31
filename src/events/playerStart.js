
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const formatduration = require("../helpers/formatDuration");
const MusicCard = require('../Schemas/musicCardSchema');
const { Classic } = require("musicard");
const fs = require("fs");
const { createCanvas, loadImage } = require('@napi-rs/canvas');


module.exports = async (client, player, track) => {
    const source = player.queue.current.sourceName || "unknown";
    const guildId = player.guildId;

    const musicCardData = await MusicCard.findOne({ guildId });
    const isMusicCardEnabled = musicCardData ? musicCardData.musicCardEnabled : false;



    if (isMusicCardEnabled) {


        // Function to create a rounded rectangle path for clipping
        function createRoundedRect(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + width, y, x + width, y + height, radius);
            ctx.arcTo(x + width, y + height, x, y + height, radius);
            ctx.arcTo(x, y + height, x, y, radius);
            ctx.arcTo(x, y, x + width, y, radius);
            ctx.closePath();
        }

        // Function to trim text and add ellipsis if needed
        function trimText(ctx, text, maxWidth, font) {
            ctx.font = font;
            let trimmedText = text;
            while (ctx.measureText(trimmedText).width > maxWidth && trimmedText.length > 0) {
                trimmedText = trimmedText.slice(0, -1); // Remove the last character
            }
            return trimmedText + (trimmedText.length < text.length ? '...' : '');
        }

        // Function to draw the background with border radius and gradient stroke
        async function drawBackground() {
            const bgImage = await loadImage('./images/background.png');
            const canvas = createCanvas(bgImage.width, bgImage.height);
            const ctx = canvas.getContext('2d');
            const borderRadius = 25; // Border radius for the background

            createRoundedRect(ctx, 0, 0, bgImage.width, bgImage.height, borderRadius);
            ctx.clip();
            ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height);

            // Add a dark mask over the background image
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Dark mask with 0.4 opacity
            ctx.fillRect(0, 0, bgImage.width, bgImage.height);

            // Add gradient stroke for the background
            const bgGradient = ctx.createLinearGradient(0, 0, bgImage.width, bgImage.height);
            bgGradient.addColorStop(0, '#ff66c4');
            bgGradient.addColorStop(1, '#ffde59');
            ctx.lineWidth = 15; // Stroke width for the background
            ctx.strokeStyle = bgGradient;
            createRoundedRect(ctx, 0, 0, bgImage.width, bgImage.height, borderRadius);
            ctx.stroke();

            // Load and draw a square image (350x350)
            const songImg = await loadImage(track.thumbnail || client.user.displayAvatarURL());
            const squareSize = 350;
            const songImgX = 20;
            const songImgY = (bgImage.height - squareSize) / 2;
            const songImgBorder = 15;

            // Save context state before clipping the square
            ctx.save();

            // Draw rounded rectangle for the square image and clip it
            createRoundedRect(ctx, songImgX, songImgY, squareSize, squareSize, songImgBorder);
            ctx.clip();
            ctx.drawImage(songImg, songImgX, songImgY, squareSize, squareSize);

            // Add stroke to the square image
            const squareGradient = ctx.createLinearGradient(songImgX, songImgY, songImgX + squareSize, songImgY + squareSize);
            squareGradient.addColorStop(0, '#ffde59');
            squareGradient.addColorStop(1, '#ff914d');
            ctx.lineWidth = 15;
            ctx.strokeStyle = squareGradient;
            createRoundedRect(ctx, songImgX, songImgY, squareSize, squareSize, songImgBorder);
            ctx.stroke();

            ctx.restore();

            // Define the rectangular shape with width 500 and height 350
            const rectX = squareSize + 30; // Position the rectangle to the right of the square image
            const rectY = (bgImage.height - 350) / 2; // Vertically center the rectangle
            const rectWidth = bgImage.width - rectX - 20; // Remaining width (rest width)
            const rectHeight = 350;
            const rectBorderRadius = 15;

            // Draw the white rectangular shape with opacity 0.3
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // White background with opacity 0.3
            createRoundedRect(ctx, rectX, rectY, rectWidth, rectHeight, rectBorderRadius);
            ctx.fill();

            // Add a stroke with opacity for the rectangle
            const rectGradient = ctx.createLinearGradient(rectX, rectY, rectX + rectWidth, rectY + rectHeight);
            rectGradient.addColorStop(0, 'rgba(255, 222, 89, 0.4)'); // Stroke color with 0.3 opacity
            rectGradient.addColorStop(1, 'rgba(255, 145, 77, 0.4)');
            ctx.lineWidth = 10;
            ctx.strokeStyle = rectGradient;
            createRoundedRect(ctx, rectX, rectY, rectWidth, rectHeight, rectBorderRadius);
            ctx.stroke();

            // --- Add Loading Bar ---
            const loadingBarWidth = bgImage.width - rectX - 75;
            const loadingBarHeight = 20;
            const loadingBarX = rectX + 30; // 25px from the start of the white rectangle
            const loadingBarY = 340; // Center vertically

            // Draw white background for the loading bar
            ctx.fillStyle = '#FFFFFF'; // Solid white
            createRoundedRect(ctx, loadingBarX, loadingBarY, loadingBarWidth, loadingBarHeight, 10);
            ctx.fill();

            // Draw gradient line representing loading progress (width 200)
            const progressWidth = 200;
            const progressGradient = ctx.createLinearGradient(loadingBarX, loadingBarY, loadingBarX + progressWidth, loadingBarY);
            progressGradient.addColorStop(0, '#5170ff'); // First color of the gradient
            progressGradient.addColorStop(1, '#ff66c4'); // Second color of the gradient

            ctx.fillStyle = progressGradient;
            createRoundedRect(ctx, loadingBarX, loadingBarY, progressWidth, loadingBarHeight, 10);
            ctx.fill();

            // Draw a filled circle at the end of the gradient loading bar
            const circleX = loadingBarX + progressWidth;
            const circleY = loadingBarY + loadingBarHeight / 2;
            const circleRadius = 15; // Circle Size

            const circleFillColor = '#ff66c4'; // Circle color
            ctx.fillStyle = circleFillColor;

            ctx.beginPath();
            ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill(); // Fill the circle with the solid color

            // Draw circle stroke with gradient
            const circleStrokeGradient = ctx.createLinearGradient(circleX - circleRadius, circleY - circleRadius, circleX + circleRadius, circleY + circleRadius);
            circleStrokeGradient.addColorStop(0, '#8c52ff'); // First color of the stroke gradient
            circleStrokeGradient.addColorStop(1, '#5ce1e6'); // Second color of the stroke gradient
            ctx.lineWidth = 5; // Stroke width
            ctx.strokeStyle = circleStrokeGradient;
            ctx.beginPath();
            ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke(); // Stroke the circle

            // --- Add Inner Rectangle Above the Progress Bar ---
            const innerRectHeight = 230; // Height of the inner rectangle
            const innerRectY = loadingBarY - innerRectHeight - 20; // 30px above the progress bar

            // Draw the inner black rectangle with opacity 0.6
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'; // Black background with opacity 0.6
            createRoundedRect(ctx, loadingBarX, innerRectY, loadingBarWidth, innerRectHeight, 10);
            ctx.fill();

            // Stroke for the inner rectangle using the same gradient as the first rectangle
            ctx.lineWidth = 10;
            ctx.strokeStyle = rectGradient; // Same stroke gradient as the first rectangle
            createRoundedRect(ctx, loadingBarX, innerRectY, loadingBarWidth, innerRectHeight, 10);
            ctx.stroke();

            // Add song name and author name text
            const songName = track.title; // Replace with actual song name
            const authorName = track.author; // Replace with actual author name

            // Set font for song name
            ctx.fillStyle = '#c6e5eb'; // Color for song name
            ctx.font = '38px Arial'; // Font size and family
            const trimmedSongName = trimText(ctx, songName, loadingBarWidth - 40, ctx.font); // Trim text if necessary
            ctx.fillText(trimmedSongName, loadingBarX + 40, innerRectY + 60); // Adjust position as needed

            // Set font for author name
            ctx.fillStyle = '#ffbd59'; // Color for author name
            ctx.font = '28px Arial'; // Font size and family
            ctx.fillText(authorName, loadingBarX + 40, innerRectY + 90); // Adjust position as needed

            // --- Add Separator Line ---
            const separatorY = innerRectY + 100 + 5; // 5px below the author name
            const separatorLength = 840; // Length of the separator line
            const separatorX = loadingBarX + 40; // Starting position of the separator

            ctx.strokeStyle = '#FFFFFF'; // Color for the separator line
            ctx.lineWidth = 2; // Line width
            ctx.beginPath();
            for (let i = 0; i < separatorLength; i += 10) {
                ctx.moveTo(separatorX + i, separatorY);
                ctx.lineTo(separatorX + i + 5, separatorY);
            }
            ctx.stroke();

            // --- Adding Icons ---
            const musicSign = await loadImage('./images/songicon.webp');
            ctx.drawImage(musicSign, 450, 210, 80, 80); // (img, x, y, width, height)

            const musicCd = await loadImage('./images/musicCd.png');
            ctx.drawImage(musicCd, 560, 210, 170, 90); // (img, x, y, width, height)

            const musicWord = await loadImage('./images/musicword.webp');
            ctx.drawImage(musicWord, 770, 210, 210, 100); // (img, x, y, width, height)

            const musicCd2 = await loadImage('./images/musicCd.png');
            ctx.drawImage(musicCd2, 1020, 210, 170, 90); // (img, x, y, width, height)

            const songIcn = await loadImage('./images/musicicon.png');
            ctx.drawImage(songIcn, 1190, 210, 120, 90); // (img, x, y, width, height)

            // --- Add Duration Time ---
            const startTime = "1:54"; // Replace with actual start time
            const endTime = `${formatduration(track.length, true)}`;
            ctx.fillStyle = '#FFFFFF'; // White color for duration text
            ctx.font = '22px Arial'; // Font size for duration text
            ctx.fillText(startTime, loadingBarX, loadingBarY + loadingBarHeight + 25); // Starting time at the beginning of the bar
            ctx.fillText(endTime, loadingBarX + loadingBarWidth - ctx.measureText(endTime).width, loadingBarY + loadingBarHeight + 25); // Ending time at the end of the bar

            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync('./output.png', buffer);
        }

        await drawBackground().catch(console.error);




        const buttonRow1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('previous').setLabel('Previous').setEmoji('<:previous:1287784603213631581>').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('pause').setLabel('Pause').setEmoji('<:resume:1287784582825115668>').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('resume').setLabel('Play').setEmoji('<:play:1287784594736807958>').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('skip').setLabel('Skip').setEmoji('<:skip:1287784611405103207>').setStyle(ButtonStyle.Primary)
            );

        const buttonRow2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('autoplay').setLabel('Autoplay').setEmoji('<:autoplay:1287784625090986036>').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('queue').setLabel('Queue').setEmoji('<:queue:1287784631663329324>').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('shuffle').setLabel('Shuffle').setEmoji('<:shuffle:1287784638647107686>').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('loop').setLabel('Loop').setEmoji('<:loop:1287784618103410760>').setStyle(ButtonStyle.Primary)
            );


        const nowPlayingMessage = await client.channels.cache.get(player.textId)?.send({
            components: [buttonRow1, buttonRow2],
            files: [{
                attachment: './output.png'
            }],
        });

        const oldMessageId = player.data.get("nowPlayingMessageId");
        if (oldMessageId) {
            try {
                const oldMessage = await client.channels.cache.get(player.textId)?.messages.fetch(oldMessageId);
                if (oldMessage) await oldMessage.delete();
                fs.unlinkSync('./output.png');
            } catch (err) {
                console.error(`Failed to delete previous Now Playing message: ${err}`);
            }
        }

        if (nowPlayingMessage) player.data.set("nowPlayingMessageId", nowPlayingMessage.id);




    } else {
        const embed = new EmbedBuilder()
            .setAuthor({ name: "🎶 Now Playing" })
            .setDescription(`**[${track.title || "Unknown"}](${track.uri})**`)
            .setColor('#F1C40F')
            .addFields(
                { name: `🎤 **Artist:**`, value: `${track.author || "Unknown"}`, inline: true },
                { name: `🙋 **Requested by:**`, value: `${track.requester}`, inline: true },
                { name: `🔊 **Volume:**`, value: `${player.options.volume}%`, inline: true },
                { name: `🎧 **Queue Length:**`, value: `${player.queue.size}`, inline: true },
                { name: `⏳ **Duration:**`, value: `${formatduration(track.length, true)}`, inline: true },
                { name: `🕒 **Total Queue Time:**`, value: `${formatduration(player.queue.durationLength + track.length, true)}`, inline: true }
            )
            .setFooter({ text: `Source: ${upCase(source)}` })
            .setTimestamp();

        if (track.thumbnail) {
            embed.setThumbnail(track.thumbnail);
        } else {
            embed.setThumbnail(client.user.displayAvatarURL());
        }

        const buttonRow1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('skip').setLabel('Skip').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('shuffle').setLabel('Shuffle').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('loop').setLabel('Loop').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('autoplay').setLabel('Autoplay').setStyle(ButtonStyle.Primary),
            );

        const buttonRow2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('previous').setLabel('Previous').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('pause').setLabel('Pause').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('resume').setLabel('Resume').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('queue').setLabel('Queue').setStyle(ButtonStyle.Secondary)
            );

        const oldMessageId = player.data.get("nowPlayingMessageId");
        if (oldMessageId) {
            try {
                const oldMessage = await client.channels.cache.get(player.textId)?.messages.fetch(oldMessageId);
                if (oldMessage) await oldMessage.delete();
            } catch (err) {
                console.error(`Failed to delete previous Now Playing message: ${err}`);
            }
        }

        const nowPlayingMessage = await client.channels.cache.get(player.textId)?.send({ embeds: [embed], components: [buttonRow1, buttonRow2] });
        if (nowPlayingMessage) player.data.set("nowPlayingMessageId", nowPlayingMessage.id);
    }
};

function upCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}

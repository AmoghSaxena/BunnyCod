const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const formatDuration = require("../../helpers/formatDuration");
const { convertTime } = require("../../helpers/convertTime");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Display the song currently playing'),

    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) {
            return interaction.reply('🎶 **No song is currently playing in this guild!**');
        }

        const song = player.queue.current;
        const totalDuration = formatDuration(song.length);

        const embed = new EmbedBuilder()
            .setColor('#F1C40F')
            .setAuthor({
                name: player.playing ? 'Now Playing 🎵' : 'Song Paused ⏸️', })
            .setDescription(`**[${song.title}](${song.uri})**`)
            .addFields(
                { name: '🎤 **Artist:**', value: `${song.author || 'Unknown'}`, inline: true },
                { name: '👤 **Requested by:**', value: `${song.requester}`, inline: true },
                { name: '🔊 **Volume:**', value: `${player.options.volume}%`, inline: true },
                { name: '📜 **Queue Length:**', value: `${player.queue.length}`, inline: true },
                { name: '⏳ **Total Duration:**', value: `${totalDuration}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Enjoy your music!', iconURL: interaction.user.displayAvatarURL() });

        if (song.thumbnail) {
            embed.setThumbnail(song.thumbnail);
        } else {
            embed.setThumbnail(interaction.user.displayAvatarURL());
        }

        return interaction.reply({ content: " ", embeds: [embed] });
    }
};

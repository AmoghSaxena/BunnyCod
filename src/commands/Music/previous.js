const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { KazagumoTrack } = require('kazagumo');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('previous')
        .setDescription('Play the previous song in the queue.'),

    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply('🎶 **No song is currently playing in this guild!**');

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.reply('🚫 **I\'m not in the same voice channel as you!**');
        }

        if (!player.queue.previous) return interaction.reply('⚠️ **No previous song found.**');

        await player.play().getPrevious();

        const embed = new EmbedBuilder()
            .setColor('#3498DB')
            .setTitle('🎵 Previous Song')
            .setDescription(`\`⏮️\` | *Now playing the previous song:*`)
            .addField('Title:', player.queue.previous.title || 'Unknown Title', true)
            .addField('Artist:', player.queue.previous.author || 'Unknown Artist', true)
            .setTimestamp()
            .setFooter({ text: 'Enjoy your music!', iconURL: interaction.user.displayAvatarURL() });

        return interaction.reply({ embeds: [embed] });
    }
};

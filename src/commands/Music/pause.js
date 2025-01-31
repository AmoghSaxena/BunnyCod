const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause or resume the music!'),

    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply('🎶 **No song is currently playing in this guild!**');

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.reply('🚫 **I\'m not in the same voice channel as you!**');
        }
        
        // Toggle pause state
        const paused = !player.paused; // If currently paused, unpause, and vice versa
        await player.pause(paused);

        const status = paused ? '⏸️ **Paused**' : '▶️ **Resumed**';

        const embed = new EmbedBuilder()
            .setColor('#E74C3C')
            .setTitle('Music Playback Status')
            .setDescription(`\`⏯\` | *The song has been:* ${status}`)
            .setTimestamp()
            .setFooter({ text: 'Enjoy your music!', iconURL: interaction.user.displayAvatarURL() });

        return interaction.reply({ embeds: [embed] });
    }
};

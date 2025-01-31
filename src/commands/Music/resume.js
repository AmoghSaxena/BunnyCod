const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the music!'),

    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply('❌ **No song is currently playing in this guild!**');

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.reply('🚫 **I\'m not in the same voice channel as you!**');
        }
        
        if (!player.paused) {
            return interaction.reply('🎶 **The music is already playing!**');
        }

        await player.pause(false); // Resume the music

        const embed = new EmbedBuilder()
            .setDescription("⏯️ **The song has been resumed!**")
            .setColor('#2ECC71') // A fresh green color
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

        return interaction.reply({ embeds: [embed] });
    }
};

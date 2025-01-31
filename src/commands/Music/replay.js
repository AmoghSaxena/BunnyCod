const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Replay the current song!'),

    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply('❌ **No song is currently playing in this guild!**');

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.reply('🚫 **I\'m not in the same voice channel as you!**');
        }

        await player.seek(0); // Replay the song

        const embed = new EmbedBuilder()
            .setDescription("⏮️ **Song has been replayed!**")
            .setColor('#3498DB') // A calming Blue color
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

        return interaction.reply({ embeds: [embed] });
    }
};

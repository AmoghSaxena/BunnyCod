const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the currently playing song.'),

    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply('🚫 **No music is currently playing in this guild!**');

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.reply('🔇 **You need to be in the same voice channel as the bot to skip the song!**');
        }

        await player.skip();

        const embed = new EmbedBuilder()
            .setDescription('⏭️ **Song has been skipped!** Enjoy the next track! 🎶')
            .setColor('Blue')
            .setFooter({ text: 'Use `/queue` to see what\'s next!' });

        return interaction.reply({ embeds: [embed] });
    }
};

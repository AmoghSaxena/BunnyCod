const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the songs in the queue!'),

    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply('🚫 **No song is currently playing in this guild!**');

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.reply('🔇 **I\'m not in the same voice channel as you!**');
        }

        await player.queue.shuffle(); 

        const embed = new EmbedBuilder()
            .setDescription('🔀 **Songs have been shuffled!** Enjoy the mix! 🎶')
            .setColor('Blue')
            .setFooter({ text: 'Use `/queue` to check the current song order.' });

        return interaction.reply({ embeds: [embed] });
    }
};

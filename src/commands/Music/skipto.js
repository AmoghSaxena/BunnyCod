const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skipto')
        .setDescription('Skips to a certain song in the queue.')
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('The position of the song in the queue.')
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction, client) {
        const value = interaction.options.getInteger('position');

        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply('🚫 **No music is currently playing in this guild!**');

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.reply('🔇 **I\'m not in the same voice channel as you!**');
        }

        if (value > player.queue.length || (value && !player.queue[value - 1])) {
            return interaction.reply('⚠️ **You can\'t skip to a song that doesn\'t exist!**');
        }

        await player.queue.splice(0, value - 1);
        await player.skip();

        const embed = new EmbedBuilder()
            .setDescription(`⏭️ | *Skipped to song in position:* \`${value}\``)
            .setColor('Blue');

        return interaction.reply({ embeds: [embed] });
    }
};

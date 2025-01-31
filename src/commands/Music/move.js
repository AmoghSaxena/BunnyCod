const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Change a song\'s position in the queue.')
        .addIntegerOption(option =>
            option.setName('from')
                .setDescription('The queue number of the song you want to move')
                .setRequired(true)
                .setMinValue(1)
        )
        .addIntegerOption(option =>
            option.setName('to')
                .setDescription('The position in the queue you want to move the song to')
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply('🚫 **No music is currently playing in this guild!**');

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.reply('🔇 **I\'m not in the same voice channel as you!**');
        }

        const fromIndex = interaction.options.getInteger('from') - 1; // Convert to 0-based index
        const toIndex = interaction.options.getInteger('to') - 1; // Convert to 0-based index

        if (fromIndex >= player.queue.length || fromIndex < 0) return interaction.reply('⚠️ **Song not found at that position.**');
        if (toIndex >= player.queue.length || toIndex < 0) return interaction.reply('⚠️ **Target position is invalid.**');

        const song = player.queue[fromIndex];

        player.queue.splice(fromIndex, 1);
        player.queue.splice(toIndex, 0, song);

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setDescription(`🎶 **Moved** • [${song.title}](${song.uri}) **to position** ${toIndex + 1}`);

        return interaction.reply({ embeds: [embed] });
    }
};

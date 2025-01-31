const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { convertTime } = require("../../helpers/convertTime");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a song from the queue.')
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('The position in the queue of the song you want to remove.')
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

        const position = interaction.options.getInteger("position");
        if (position > player.queue.length || position < 1) {
            return interaction.reply('⚠️ **Song not found at that position.**');
        }

        const song = player.queue[position - 1]; // Convert to 0-based index
        await player.queue.splice(position - 1, 1); // Remove the song

        const embed = new EmbedBuilder()
            .setColor('RED')
            .setDescription(`🎵 **Removed** • [${song.title}](${song.uri}) \`${convertTime(song.length, true)}\` • Requested by: ${song.requester}`);

        return interaction.reply({ embeds: [embed] });
    }
};

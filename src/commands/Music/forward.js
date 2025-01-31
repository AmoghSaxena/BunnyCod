const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../helpers/formatDuration');

const fastForwardNum = 10; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forward')
        .setDescription('Forward the currently playing song.')
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('How many seconds to forward? (default is 10)')
                .setRequired(false)
                .setMinValue(1)
        ),

    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply('🚫 **No music is currently playing in this guild!**');

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.reply('🔇 **I\'m not in the same voice channel as you!**');
        }

        const value = interaction.options.getInteger('seconds') || fastForwardNum; // Use provided value or default
        const song = player.queue.current;
        const currentDuration = formatDuration(player.position);

        if (player.position + value * 1000 < song.length) {
            await player.seek(player.position + value * 1000);

            const newDuration = formatDuration(player.position + value * 1000);
            const embed = new EmbedBuilder()
                .setDescription(`⏭️ | *Forwarded to:* \`${newDuration}\``)
                .setColor('Green')
                .setFooter({ text: 'Enjoy your music! 🎶' });

            return interaction.reply({ embeds: [embed] });
        } else {
            return interaction.reply('⚠️ **You can\'t forward beyond the duration of the song!**');
        }
    }
};

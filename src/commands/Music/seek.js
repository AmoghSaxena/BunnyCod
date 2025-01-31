const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../helpers/formatDuration');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a specific timestamp in the currently playing song.')
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('The number of seconds to seek by.')
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction, client) {
        const value = interaction.options.getInteger('seconds');
        
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply('🚫 **No music is currently playing in this guild!**');
        
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.reply('🔇 **I\'m not in the same voice channel as you!**');
        }

        if (value * 1000 >= player.queue.current.length || value < 0) {
            return interaction.reply('⚠️ **You can\'t seek more than the duration of the song!**');
        }

        await player.seek(value * 1000);
        
        const duration = formatDuration(player.position);
        const embed = new EmbedBuilder()
            .setDescription(`⏮️ | *Seeked to:* \`${duration}\``)
            .setColor('Blue');

        return interaction.reply({ embeds: [embed] });
    }
};

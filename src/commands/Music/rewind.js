const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../helpers/formatDuration');

const rewindNum = 10;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rewind')
        .setDescription('Rewind the currently playing song.')
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('How many seconds to rewind?')
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

        const value = interaction.options.getInteger("seconds");
        const currentDuration = formatDuration(player.position);

        // Rewind with specified seconds
        if (value) {
            if ((player.position - value * 1000) > 0) {
                await player.seek(player.position - value * 1000);
                
                const embed = new EmbedBuilder()
                    .setDescription(`⏮️ | *Rewinded to:* \`${formatDuration(player.position)}\``)
                    .setColor('Blue');

                return interaction.reply({ embeds: [embed] });
            } else {
                return interaction.reply('⚠️ **You can\'t rewind more than the current timestamp of the song!**');
            }
        } else {
            // Default rewind amount
            if ((player.position - rewindNum * 1000) > 0) {
                await player.seek(player.position - rewindNum * 1000);
                
                const embed = new EmbedBuilder()
                    .setDescription(`⏮️ | *Rewinded to:* \`${formatDuration(player.position)}\``)
                    .setColor('Blue');

                return interaction.reply({ embeds: [embed] });
            } else {
                return interaction.reply('⚠️ **You can\'t rewind more than the current timestamp of the song!**');
            }
        }
    }
};

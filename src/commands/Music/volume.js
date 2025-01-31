const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Adjust the volume of the bot.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of volume to set the bot to (1-100).')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(100)
        ),

    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply('🚫 **No music is currently playing in this guild!**');

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.reply('🔇 **You need to be in the same voice channel as the bot to change the volume!**');
        }

        const volumeAmount = interaction.options.getInteger('amount');

        if (!volumeAmount) {
            return interaction.reply(`🔊 **Current volume:** ${player.volume}%`);
        }

        await player.setVolume(Number(volumeAmount));

        const embed = new EmbedBuilder()
            .setDescription(`\`🔉\` | *Volume has been set to:* \`${volumeAmount}%\``)
            .setColor('Orange')
            .setFooter({ text: 'Enjoy your music at the perfect volume! 🎶' });

        return interaction.reply({ embeds: [embed] });
    }
};

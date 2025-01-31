const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('twentyfourseven')
        .setDescription('Toggle 24/7 mode in the voice channel'),

    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply('🚫 **No song is currently playing in this guild!**');

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.reply('🔇 **You need to be in the same voice channel as the bot!**');
        }

        const isActive = player.data.get("stay");
        await player.data.set("stay", !isActive);

        const status = isActive ? 'Deactivated' : 'Activated';
        const emoji = isActive ? '🌅' : '🌈';
        const description = `**24/7 Mode has been:** \`${status}\``;

        const embed = new EmbedBuilder()
            .setColor(isActive ? 'Red' : 'Green')
            .setDescription(`${emoji} ${description}`)
            .setFooter({ text: 'Enjoy your endless music! 🎶' });

        return interaction.reply({ embeds: [embed] });
    }
};

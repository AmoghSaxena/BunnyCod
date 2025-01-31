const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the current music queue!'),

    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("❌ **No music is currently playing in this server!**")
                ], 
                ephemeral: true
            });
        }
        
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("⚠️ **You must be in the same voice channel as me to clear the queue!**")
                ], 
                ephemeral: true
            });
        }

        await player.queue.clear();

        const embed = new EmbedBuilder()
            .setTitle('🗑️ Queue Cleared')
            .setDescription("`📛` | The music queue has been successfully **cleared**. No more songs are left in the queue.")
            .setColor('#3498DB') // A bright Blue for a professional look
            .setThumbnail(client.user.displayAvatarURL()) // Bot's avatar as the thumbnail
            .setFooter({ text: `Action performed by: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};

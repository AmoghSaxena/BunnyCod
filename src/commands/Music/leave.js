const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Disconnect the bot from your voice channel.'),
    
    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        
        if (!player) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("❌ **There is no music playing in this guild!**")
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
                        .setDescription("🔒 **You need to be in the same voice channel as me to disconnect!**")
                ], 
                ephemeral: true
            });
        }

        await player.destroy();

        const embed = new EmbedBuilder()
            .setTitle('🚫 Disconnected')
            .setDescription(`**Left the channel:** \`${channel.name}\``)
            .setColor('#E74C3C') 
            .setFooter({ text: `Goodbye!`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};

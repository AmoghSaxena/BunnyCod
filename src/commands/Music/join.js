const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Summon the bot to your voice channel.'),
    
    async execute(interaction, client) {
        const { channel } = interaction.member.voice;

        if (!channel) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("❌ **You need to be in a voice channel to summon the bot!**")
                ], 
                ephemeral: true
            });
        }

        if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("⚠️ **I don't have permission to join your voice channel!**")
                ], 
                ephemeral: true
            });
        }

        if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("🔇 **I don't have permission to speak in your voice channel!**")
                ], 
                ephemeral: true
            });
        }

        client.manager.createPlayer({
            guildId: interaction.guild.id,
            textId: interaction.channel.id,
            voiceId: channel.id,
            volume: 100,
            deaf: true
        });

        const embed = new EmbedBuilder()
            .setTitle('🎶 Bot Joined')
            .setDescription(`🔊 **Successfully joined:** \`${channel.name}\``)
            .setColor('#3498DB') 
            .setFooter({ text: `Requested by: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};

const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loops the current song or the entire queue!')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Select the loop mode')
                .setRequired(true)
                .addChoices(
                    { name: 'Current', value: 'current' },
                    { name: 'Queue', value: 'queue' }
                )
        ),

    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("❌ **No song is currently playing in this guild!**")
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
                        .setDescription("🔒 **I'm not in the same voice channel as you!**")
                ],
                ephemeral: true
            });
        }

        const choice = interaction.options.getString('mode');

        if (choice === 'current') {
            if (player.loop === 'none') {
                player.setLoop('track');

                const embed = new EmbedBuilder()
                    .setTitle('🔁 Loop Status')
                    .setDescription(`**Current song has been:** \`Looped\``)
                    .setColor('#F1C40F') // Bright yellow for active loop
                    .setFooter({ text: 'Enjoy your music!', iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();

                return interaction.reply({ embeds: [embed] });
            } else {
                player.setLoop('none');

                const embed = new EmbedBuilder()
                    .setTitle('🔁 Loop Status')
                    .setDescription(`**Current song has been:** \`Unlooped\``)
                    .setColor('#E74C3C') // Bright red for unlooped status
                    .setFooter({ text: 'Happy listening!', iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();

                return interaction.reply({ embeds: [embed] });
            }
        } else if (choice === 'queue') {
            if (player.loop === 'queue') {
                player.setLoop('none');

                const embed = new EmbedBuilder()
                    .setTitle('🔁 Loop Status')
                    .setDescription(`**Looping all has been:** \`Disabled\``)
                    .setColor('#E74C3C') // Bright red for disabled status
                    .setFooter({ text: 'Feel free to add more songs!', iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();

                return interaction.reply({ embeds: [embed] });
            } else {
                player.setLoop('queue');

                const embed = new EmbedBuilder()
                    .setTitle('🔁 Loop Status')
                    .setDescription(`**Looping all has been:** \`Enabled\``)
                    .setColor('#F1C40F') // Bright yellow for active loop
                    .setFooter({ text: 'Enjoy your endless music!', iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();

                return interaction.reply({ embeds: [embed] });
            }
        }
    }
};

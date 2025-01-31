const MusicCard = require('../../Schemas/musicCardSchema');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music-card')
        .setDescription('Toggle the music card feature.')
        .addBooleanOption(option =>
            option.setName('enable')
                .setDescription('Enable or disable the music card feature.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const enable = interaction.options.getBoolean('enable');

        let musicCard = await MusicCard.findOne({ guildId });

        if (!musicCard) {
            musicCard = new MusicCard({ guildId, musicCardEnabled: enable });
        } else {
            musicCard.musicCardEnabled = enable;
        }

        await musicCard.save();

        const embed = new EmbedBuilder()
            .setTitle('Music Card Status Updated')
            .setDescription(`The music card feature is now **${enable ? 'enabled' : 'disabled'}**.`)
            .addFields(
                { name: 'Information', value: enable 
                    ? 'Songs will be displayed in a music card when played.' 
                    : 'Songs will be shown in an embed instead of a music card.', inline: false }
            )
            .setColor(enable ? '#28A745' : '#DC3545')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

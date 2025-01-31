const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { find } = require('llyrics');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyric')
        .setDescription('Display lyrics of a song.')
        .addStringOption(option =>
            option.setName('result')
                .setDescription('Song name to return lyrics for.')
                .setRequired(false)),

    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false });
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.editReply(`No song is currently playing in this guild!`);

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.editReply(`I'm not in the same voice channel as you!`);
        }

        let song = interaction.options.getString('result');
        const CurrentSong = player.queue.current;
        if (!song && CurrentSong) song = CurrentSong.title;

        try {
            const lyrics = await find({
                song: `${song}`,
                engine: 'youtube',
                forceSearch: true,
            });
            if (!lyrics) return interaction.editReply(`No lyrics found for ${song}`);

            const lyricsEmbed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle(`🎶 Lyrics for: ${song}`)
                .setDescription(lyrics.lyrics > 2048 ? `Lyrics are too long to display!` : lyrics.lyrics)
                .setThumbnail(lyrics.artworkURL)
                .setTimestamp();

            return interaction.editReply({ content: ' ', embeds: [lyricsEmbed] });
        } catch (err) {
            console.error(err);
            return interaction.editReply(`An error occurred while fetching lyrics for ${song}`);
        }
    }
};

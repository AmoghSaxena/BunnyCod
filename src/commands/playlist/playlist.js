const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const Playlist = require('../../Schemas/playlistSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Manage your playlists')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a new playlist')
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('The name of the playlist')
                        .setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a song to an existing playlist')
                .addStringOption(option =>
                    option
                        .setName('playlist_name')
                        .setDescription('The name of the playlist')
                        .setRequired(true),
                )
                .addStringOption(option =>
                    option
                        .setName('song')
                        .setDescription('The name or URL of the song')
                        .setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a song from an existing playlist')
                .addStringOption(option =>
                    option
                        .setName('playlist_name')
                        .setDescription('The name of the playlist')
                        .setRequired(true),
                )
                .addStringOption(option =>
                    option
                        .setName('song')
                        .setDescription('The name or URL of the song to remove')
                        .setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete an existing playlist')
                .addStringOption(option =>
                    option
                        .setName('playlist_name')
                        .setDescription('The name of the playlist')
                        .setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Show all playlists with details for the user'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View all songs in a playlist')
                .addStringOption(option =>
                    option
                        .setName('playlist_name')
                        .setDescription('The name of the playlist')
                        .setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("play")
                .setDescription("Play all songs in a playlist")
                .addStringOption(option =>
                    option.setName("playlist_name")
                        .setDescription("The name of the playlist to play.")
                        .setRequired(true)
                )
        ),

    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        if (subcommand === 'create') {
            const playlistName = interaction.options.getString('name');

            try {
                const existingPlaylist = await Playlist.findOne({
                    userId: userId,
                    'playlists.playlistName': playlistName,
                });

                if (existingPlaylist) {
                    return interaction.reply({
                        content: `You already have a playlist with the name **${playlistName}**.`,
                        ephemeral: true,
                    });
                }

                await Playlist.updateOne(
                    { userId: userId },
                    { $push: { playlists: { playlistName: playlistName, songs: [], songCount: 0 } } },
                    { upsert: true },
                );

                return interaction.reply({
                    content: `Playlist **${playlistName}** created successfully!`,
                    ephemeral: true,
                });
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: 'An error occurred while creating the playlist. Please try again later.',
                    ephemeral: true,
                });
            }
        } else if (subcommand === 'add') {
            const playlistName = interaction.options.getString('playlist_name');
            const song = interaction.options.getString('song');

            try {
                const userPlaylist = await Playlist.findOne({
                    userId: userId,
                    'playlists.playlistName': playlistName,
                });

                if (!userPlaylist) {
                    return interaction.reply({
                        content: `No playlist found with the name **${playlistName}**. Please create one first.`,
                        ephemeral: true,
                    });
                }

                await Playlist.updateOne(
                    { userId: userId, 'playlists.playlistName': playlistName },
                    {
                        $push: { 'playlists.$.songs': song }, // Directly pushing the song string
                        $inc: { 'playlists.$.songCount': 1 }, // Increment song count
                    },
                );

                return interaction.reply({
                    content: `Song added to the playlist **${playlistName}** successfully!`,
                    ephemeral: true,
                });
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: 'An error occurred while adding the song. Please try again later.',
                    ephemeral: true,
                });
            }


        } else if (subcommand === 'remove') {
            const playlistName = interaction.options.getString('playlist_name');
            const song = interaction.options.getString('song');

            try {
                const userPlaylist = await Playlist.findOne({
                    userId: userId,
                    'playlists.playlistName': playlistName,
                });

                if (!userPlaylist) {
                    return interaction.reply({
                        content: `No playlist found with the name **${playlistName}**. Please create one first.`,
                        ephemeral: true,
                    });
                }

                const songExists = userPlaylist.playlists.find(p => p.playlistName === playlistName)
                    .songs.includes(song);

                if (!songExists) {
                    return interaction.reply({
                        content: `No song with the name or URL **${song}** found in the playlist **${playlistName}**.`,
                        ephemeral: true,
                    });
                }

                await Playlist.updateOne(
                    { userId: userId, 'playlists.playlistName': playlistName },
                    {
                        $pull: { 'playlists.$.songs': song },
                        $inc: { 'playlists.$.songCount': -1 },
                    },
                );

                return interaction.reply({
                    content: `Song removed from the playlist **${playlistName}** successfully!`,
                    ephemeral: true,
                });
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: 'An error occurred while removing the song. Please try again later.',
                    ephemeral: true,
                });
            }
        } else if (subcommand === 'delete') {
            const playlistName = interaction.options.getString('playlist_name');

            try {
                const userPlaylist = await Playlist.findOne({
                    userId: userId,
                    'playlists.playlistName': playlistName,
                });

                if (!userPlaylist) {
                    return interaction.reply({
                        content: `No playlist found with the name **${playlistName}**.`,
                        ephemeral: true,
                    });
                }

                await Playlist.updateOne(
                    { userId: userId },
                    { $pull: { playlists: { playlistName: playlistName } } },
                );

                return interaction.reply({
                    content: `Playlist **${playlistName}** deleted successfully!`,
                    ephemeral: true,
                });
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: 'An error occurred while deleting the playlist. Please try again later.',
                    ephemeral: true,
                });
            }
        } else if (subcommand === 'list') {
            try {
                const userPlaylists = await Playlist.findOne({ userId: userId });

                if (!userPlaylists || userPlaylists.playlists.length === 0) {
                    return interaction.reply({
                        content: 'You do not have any playlists.',
                        ephemeral: true,
                    });
                }

                const embed = new EmbedBuilder()
                    .setTitle(`${interaction.user.username}'s Playlists`)
                    .setColor('#00FF00')
                    .setTimestamp();

                userPlaylists.playlists.forEach(playlist => {
                    embed.addFields([
                        { name: `Playlist: **${playlist.playlistName}**`, value: `Total Songs: ${playlist.songCount}`, inline: true },
                    ]);
                });

                return interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: 'An error occurred while fetching the playlists. Please try again later.',
                    ephemeral: true,
                });
            }
        } else if (subcommand === 'view') {
            const playlistName = interaction.options.getString('playlist_name');

            try {
                const userPlaylist = await Playlist.findOne({
                    userId: userId,
                    'playlists.playlistName': playlistName,
                });

                if (!userPlaylist) {
                    return interaction.reply({
                        content: `No playlist found with the name **${playlistName}**.`,
                        ephemeral: true,
                    });
                }

                const playlist = userPlaylist.playlists.find(p => p.playlistName === playlistName);

                if (playlist.songs.length === 0) {
                    return interaction.reply({
                        content: `The playlist **${playlistName}** has no songs.`,
                        ephemeral: true,
                    });
                }

                const embed = new EmbedBuilder()
                    .setTitle(`Songs in **${playlistName}**`)
                    .setColor('#00FF00')
                    .setDescription(playlist.songs.map((song, index) => `${index + 1}. ${song}`).join('\n'))
                    .setTimestamp();

                return interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: 'An error occurred while fetching the songs. Please try again later.',
                    ephemeral: true,
                });
            }
        } else if (subcommand === 'play') {
            try {
                const playlistName = interaction.options.getString("playlist_name");
                const { channel } = interaction.member.voice;

                if (!channel) {
                    return interaction.reply({
                        content: "🚫 **You need to be in a voice channel to play music!**",
                        ephemeral: true
                    });
                }

                if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)) {
                    return interaction.reply({
                        content: "🔒 **I don't have permission to join your voice channel!**",
                        ephemeral: true
                    });
                }

                if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) {
                    return interaction.reply({
                        content: "🔇 **I don't have permission to play music in your voice channel!**",
                        ephemeral: true
                    });
                }

                await interaction.reply({ content: `🎶 Playing playlist: **${playlistName}**...` });

                const player = await client.manager.createPlayer({
                    guildId: interaction.guild.id,
                    textId: interaction.channel.id,
                    voiceId: channel.id,
                    volume: 100,
                    deaf: true
                });

                // Fetch the playlist from the database
                const playlistData = await Playlist.findOne({
                    userId: interaction.user.id,
                    'playlists.playlistName': playlistName
                });

                if (!playlistData) {
                    return interaction.editReply(`❌ **No playlist found with the name:** ${playlistName}`);
                }

                const songs = playlistData.playlists.find(pl => pl.playlistName === playlistName).songs;

                if (songs.length === 0) {
                    return interaction.editReply(`🚫 **The playlist is empty!**`);
                }

                // Add songs to the player queue
                for (let song of songs) {
                    const res = await player.search(song, { requester: interaction.user }); // Use song directly since it's a string
                    if (res.tracks.length > 0) {
                        player.queue.add(res.tracks[0]);
                    } else {
                        console.log(`No track found for: ${song}`);
                    }
                }

                if (!player.playing && !player.paused) {
                    player.play();
                }

                const embed = new EmbedBuilder()
                    .setColor("#1DB954")
                    .setTitle("🎶 Playlist Started")
                    .setDescription(`Playing songs from **${playlistName}**!`)
                    .setFooter({ text: "Enjoy your music! 🎧" });

                return interaction.editReply({ content: '', embeds: [embed] });
            } catch (error) {
                console.error(error);
                return interaction.reply("❗ **An error occurred while trying to play the playlist.**");
            }

        }
    }
}

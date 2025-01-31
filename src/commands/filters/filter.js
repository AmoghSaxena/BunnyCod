const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('Apply audio filters to the player.')
        .addSubcommand(subcommand =>
            subcommand.setName('eightd').setDescription('Turn on 3D filter for immersive audio.'))
        .addSubcommand(subcommand =>
            subcommand.setName('soft').setDescription('Turn on a soft bass filter for smoother sound.'))
        .addSubcommand(subcommand =>
            subcommand.setName('speed').setDescription('Adjust the playback speed of the audio.'))
        .addSubcommand(subcommand =>
            subcommand.setName('karaoke').setDescription('Turn on chipmunk filter for a karaoke effect.'))
        .addSubcommand(subcommand =>
            subcommand.setName('nightcore').setDescription('Increase the tempo and pitch for a nightcore effect.'))
        .addSubcommand(subcommand =>
            subcommand.setName('pop').setDescription('Custom equalizer settings for pop music.'))
        .addSubcommand(subcommand =>
            subcommand.setName('vaporwave').setDescription('Apply a vaporwave aesthetic filter to the audio.'))
        .addSubcommand(subcommand =>
            subcommand.setName('bass').setDescription('Boost the bass frequencies for a deeper sound.'))
        .addSubcommand(subcommand =>
            subcommand.setName('party').setDescription('Enhance the audio for a party atmosphere.'))
        .addSubcommand(subcommand =>
            subcommand.setName('earrape').setDescription('Intensify the audio to extreme levels.'))
        .addSubcommand(subcommand =>
            subcommand.setName('equalizer').setDescription('Apply custom equalizer settings to the audio.'))
        .addSubcommand(subcommand =>
            subcommand.setName('electronic').setDescription('Optimize audio for electronic music genres.'))
        .addSubcommand(subcommand =>
            subcommand.setName('radio').setDescription('Adjust audio settings for radio playback.'))
        .addSubcommand(subcommand =>
            subcommand.setName('tremolo').setDescription('Add a tremolo effect to the audio.'))
        .addSubcommand(subcommand =>
            subcommand.setName('treblebass').setDescription('Adjust treble and bass levels for balanced sound.'))
        .addSubcommand(subcommand =>
            subcommand.setName('vibrato').setDescription('Apply a vibrato effect to the audio.'))
        .addSubcommand(subcommand =>
            subcommand.setName('china').setDescription('Apply a filter reminiscent of traditional Chinese music.'))
        .addSubcommand(subcommand =>
            subcommand.setName('chimpunk').setDescription('Enhance the pitch for a chipmunk voice effect.'))
        .addSubcommand(subcommand =>
            subcommand.setName('darthvader').setDescription('Deepen the voice for a Darth Vader effect.'))
        .addSubcommand(subcommand =>
            subcommand.setName('daycore').setDescription('Slow down the tempo for a daycore effect.'))
        .addSubcommand(subcommand =>
            subcommand.setName('doubletime').setDescription('Speed up the playback for a double time effect.'))
        .addSubcommand(subcommand =>
            subcommand.setName('pitch').setDescription('Adjust the pitch of the audio.'))
        .addSubcommand(subcommand =>
            subcommand.setName('rate').setDescription('Change the rate of the audio playback.'))
        .addSubcommand(subcommand =>
            subcommand.setName('slow').setDescription('Slow down the audio playback.'))
        .addSubcommand(subcommand =>
            subcommand.setName('clear').setDescription('Reset all audio filters to default.')),

    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.editReply('🚫 **No music is currently playing in this guild!**');

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'eightd':
                await player.filter("eightD");
                interaction.reply({ content: 'eightD filter is enabled.' });
                break;
            case 'soft':
                await player.filter("soft");
                interaction.reply({ content: 'Soft bass filter is enabled.' });
                break;
            case 'speed':
                await player.setFilter("speed"); // Adjust as necessary for your implementation
                interaction.reply({ content: 'Playback speed filter is enabled.' });
                break;
            case 'karaoke':
                await player.filter("karaoke");
                interaction.reply({ content: 'Karaoke filter is enabled.' });
                break;
            case 'nightcore':
                await player.filter("nightcore");
                interaction.reply({ content: 'Nightcore filter is enabled.' });
                break;
            case 'pop':
                await player.filter("pop");
                interaction.reply({ content: 'Pop equalizer settings are applied.' });
                break;
            case 'vaporwave':
                await player.filter("vaporwave");
                interaction.reply({ content: 'Vaporwave filter is enabled.' });
                break;
            case 'bass':
                await player.filter("bass");
                interaction.reply({ content: 'Bass boost is enabled.' });
                break;
            case 'party':
                await player.filter("party");
                interaction.reply({ content: 'Party audio settings are applied.' });
                break;
            case 'earrape':
                await player.filter("earrape");
                interaction.reply({ content: 'Earrape filter is enabled.' });
                break;
            case 'equalizer':
                await player.filter("equalizer");
                interaction.reply({ content: 'Custom equalizer settings are applied.' });
                break;
            case 'electronic':
                await player.filter("electronic");
                interaction.reply({ content: 'Electronic audio settings are applied.' });
                break;
            case 'radio':
                await player.filter("radio");
                interaction.reply({ content: 'Radio audio settings are applied.' });
                break;
            case 'tremolo':
                await player.filter("tremolo");
                interaction.reply({ content: 'Tremolo effect is enabled.' });
                break;
            case 'treblebass':
                await player.filter("treblebass");
                interaction.reply({ content: 'Treble and bass levels adjusted.' });
                break;
            case 'vibrato':
                await player.filter("vibrato");
                interaction.reply({ content: 'Vibrato effect is enabled.' });
                break;
            case 'china':
                await player.filter("china");
                interaction.reply({ content: 'China filter is enabled.' });
                break;
            case 'chimpunk':
                await player.filter("chimpunk");
                interaction.reply({ content: 'Chipmunk effect is enabled.' });
                break;
            case 'darthvader':
                await player.filter("darthvader");
                interaction.reply({ content: 'Darth Vader effect is enabled.' });
                break;
            case 'daycore':
                await player.filter("daycore");
                interaction.reply({ content: 'Daycore effect is enabled.' });
                break;
            case 'doubletime':
                await player.filter("doubletime");
                interaction.reply({ content: 'Double time effect is enabled.' });
                break;
            case 'pitch':
                await player.filter("pitch");
                interaction.reply({ content: 'Pitch adjustment is enabled.' });
                break;
            case 'rate':
                await player.filter("rate");
                interaction.reply({ content: 'Playback rate is adjusted.' });
                break;
            case 'slow':
                await player.filter("slow");
                interaction.reply({ content: 'Slow playback is enabled.' });
                break;
            case 'clear':
                await player.filter('clear');
                interaction.reply({ content: 'All audio filters have been cleared.' });
                break;
            default:
                interaction.reply({ content: '🚫 **Invalid filter option!**' });
                break;
        }
    }
};

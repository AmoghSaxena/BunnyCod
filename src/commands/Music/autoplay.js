const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Autoplay music (Randomly play songs)'),

    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("❌ **No music is currently playing in this server!**")
            ], 
            ephemeral: true
        });

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("⚠️ **You need to be in the same voice channel as me to use this command!**")
                ], 
                ephemeral: true
            });
        }

        if (player.data.get("autoplay")) {
            await player.data.set("autoplay", false);
            await player.queue.clear();

            const embed = new EmbedBuilder()
                .setTitle("🎶 Autoplay Deactivated")
                .setDescription("`📻` | Autoplay has been **disabled**. The queue has been cleared, and no more random songs will be played.")
                .setColor('#E74C3C') 
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter({ text: 'Autoplay Off', iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } else {
            const identifier = player.queue.current.identifier;
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            const res = await player.search(search, { requester: interaction.user });
            if (!res.tracks.length) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("⚠️ **Autoplay is not supported for this track source!**")
                ], 
                ephemeral: true
            });

            await player.data.set("autoplay", true);
            await player.data.set("requester", interaction.user);
            await player.data.set("identifier", identifier);
            await player.queue.add(res.tracks[1]);

            const embed = new EmbedBuilder()
                .setTitle("🎶 Autoplay Activated")
                .setDescription("`📻` | Autoplay has been **enabled**. Random songs will now continue to play after the current queue.")
                .setColor('#2ECC71') 
                .addFields(
                    { name: "💽 **Current Song**", value: `[${player.queue.current.title}](${player.queue.current.uri})`, inline: true },
                    { name: "👤 **Requested by**", value: `${interaction.user}`, inline: true }
                )
                .setThumbnail(player.queue.current.thumbnail || client.user.displayAvatarURL())
                .setFooter({ text: 'Autoplay On', iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }
    }
};

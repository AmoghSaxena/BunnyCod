const { EmbedBuilder } = require("discord.js");

module.exports = async (client, player) => {
    if (!player || !player.textId) {
        console.error("Player or textId is undefined.");
        return;
    }

    const channel = client.channels?.cache?.get(player.textId);
    if (!channel) {
        console.error(`Could not find channel with ID: ${player.textId}`);
        return;
    }

    if (player.data.get("stay")) return;

    const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle("🎶 Music Playback Ended")
        .setDescription("`📛` | **The song has ended.** The queue is now empty and the player has been stopped.")
        .setFooter({ text: "Thanks for listening! 🎧", iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

    await channel.send({ embeds: [embed] });

    return player.destroy();
};

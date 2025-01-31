const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require ('discord.js');
const fs = require ('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List of all commands.'),

    async execute(interaction, client) {
        const commandFolders = fs.readdirSync('./src/commands').filter(folder => !folder.startsWith('.'));
        const commandsByCategory = {};

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
            const commands = [];

            for (const file of commandFiles) {
                const { default: command } = await import(`./../${folder}/${file}`);
                commands.push({ name: command.data.name, description: command.data.description });
            }

            commandsByCategory[folder] = commands;
        }

        const dropdownOptions = Object.keys(commandsByCategory).map(folder => ({
            label: folder,
            value: folder
        }));

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('category-select')
            .setPlaceholder('Select a category')
            .addOptions(...dropdownOptions.map(option => ({
                label: option.label,
                value: option.value
            })));

        const embed = new EmbedBuilder()
            .setTitle('Help Menu')
            .setColor('Random')
            .setDescription('Select a category from the dropdown menu to view commands. if you face any issues and want to suggest any commands join our [support server](https://discord.gg/ethical-programmer-s-1188398653530984539).')
            .setThumbnail(`${client.user.displayAvatarURL()}`)
            .setFooter({text: 'Ethical Programmer'})
            .setTimestamp()

            const row = new ActionRowBuilder()
			.addComponents(selectMenu);

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.isStringSelectMenu() && i.customId === 'category-select';
        const collector = interaction.channel.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
            const selectedCategory = i.values[0];
            const categoryCommands = commandsByCategory[selectedCategory];

            const categoryEmbed = new EmbedBuilder()
                .setTitle(`${selectedCategory} Commands`)
                .setDescription('List of all commands in this category.')
                .setThumbnail(`${client.user.displayAvatarURL()}`)
                .setColor('Random')
                .addFields(categoryCommands.map(command => ({
                    name: `🟡 ${command.name}`,
                    value: `📓 ${command.description}`
                })));

            await i.update({ embeds: [categoryEmbed] });
        });
    }
};

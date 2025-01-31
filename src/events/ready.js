const { ActivityType } = require('discord.js');
const { default: mongoose, mongo } = require('mongoose');
const mongoDBURL = process.env.MongoDBURL;
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Ready!');

       

        client.user.setPresence({
            activities: [{
                 type: ActivityType.Custom,
                 name: "custom", 
                 state: "🎸 Playing Music"
            }]
        })
        if (!mongoDBURL) return;
        await mongoose.connect(mongoDBURL);
        if (mongoose.connect) {
            console.log('MongoDb Connected!')
        }
        async function pickPresence() {
            const option = Math.floor(Math.random() * statusArray.length);

            try {
                await client.user.setPresence({
                    activities: [
                        {
                            name: statusArray[option].content,
                            type: statusArray[option].type,

                        },

                    ],

                    status: statusArray[option].status
                })
            } catch (error) {
                console.error(error);
            }
        }
    },
};
import { DiscordCommand } from "../DiscordCommand";

export const pingCommand = new DiscordCommand({
    name: 'ping',
    description: 'Replies with Pong!',
},
    async (interaction) => {
        await interaction.reply('Pong!');
    }
);

import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { DiscordCommand } from "../DiscordCommand";

export const flagCommand = new DiscordCommand({
    name: 'flag',
    description: 'Submit a flag!',
    options: [
        {
            name: 'flag',
            description: 'Flag to submit',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ]
},
    async (interaction, db, client) => {
        const flag = interaction.options.getString('flag', true);
        const user = interaction.user;
        const hasSolve = await db.hasSolve(user, flag);
        if (hasSolve) {
            await interaction.reply({ content: 'You already solved this challenge!', ephemeral: true });
            return;
        }

        const challenge = await db.createSolve(user, flag);
        if (challenge) {
            await interaction.reply({ content: `Congratulations, successfully solved challenge ${challenge.name}`, ephemeral: true });
            // according to github copilot
            if (challenge.category === 'forensics') {
                await interaction.reply({ content: 'https://www.youtube.com/watch?v=QH2-TGUlwu4', ephemeral: true });
            }
            if ((await db.getSolvesByChallengeId(challenge.id)).length === 1) {
                await client.postToAnnouncements(`Congratulations to ${user.username} for being the first to solve ${challenge.name}!`);
            }
        } else {
            await interaction.reply({ content: 'Wrong flag!', ephemeral: true });
        }
    }
);

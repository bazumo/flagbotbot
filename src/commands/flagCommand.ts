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
    async (interaction, db) => {
        const flag = interaction.options.getString('flag', true);
        const user = interaction.user;
        console.log("FLAG", flag);

        const hasSolve = await db.hasSolve(user, flag);
        if (hasSolve) {
            await interaction.reply({ content: 'You already solved this challenge!', ephemeral: true });
            return;
        }

        const challenge = await db.createSolve(user, flag);
        console.log(challenge);
        if (challenge) {
            await interaction.reply({ content: `Congratulations, successfully solved challenge ${challenge.name}`, ephemeral: true });
        } else {
            await interaction.reply({ content: 'Wrong flag!', ephemeral: true });
        }
    }
);

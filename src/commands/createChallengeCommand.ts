import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { DiscordCommand } from "../DiscordCommand";

export const createChallengeCommand = new DiscordCommand(
    {
        name: 'create_challenge',
        description: 'Create a new challenge',
        options: [
            {
                name: 'name',
                description: 'Name of the challenge',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'category',
                description: 'Category of the challenge',
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: "pwn",
                        value: "pwn"
                    },
                    {
                        name: "web",
                        value: "web"
                    },
                    {
                        name: "misc",
                        value: "misc"
                    },
                    {
                        name: "crypto",
                        value: "crypto"
                    },
                    {
                        name: "rev",
                        value: "rev"
                    }
                ],
                required: true,
            },
            {
                name: 'flag',
                description: 'Flag or the challenge',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ]
    },

    async (interaction, db) => {
        const name = interaction.options.getString('name', true);
        const category = interaction.options.getString('category', true);
        const flag = interaction.options.getString('flag', true);
        await db.createChallenge(name, category, flag);
        await interaction.reply({ content: 'Successfully created challenge!', ephemeral: true });
    }
);

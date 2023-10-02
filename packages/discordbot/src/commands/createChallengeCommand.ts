import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { DiscordCommand } from "../DiscordCommand";
import { categoryOption, isCommitteeMember } from "./shared";





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
                name: 'description',
                description: 'Description of the challenge, put a link to the challenge here',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                ...categoryOption,
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

        if (!isCommitteeMember(interaction)) {
            await interaction.reply({ content: 'Only committee members can create challenges!', ephemeral: true });
            return
        }
        const name = interaction.options.getString('name', true);
        const description = interaction.options.getString('description', true);
        const category = interaction.options.getString('category', true);
        const flag = interaction.options.getString('flag', true);
        await db.createChallenge(name, description, category, flag);
        await interaction.reply({ content: 'Successfully created challenge!', ephemeral: true });
    }
);

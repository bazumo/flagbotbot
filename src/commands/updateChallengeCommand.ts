import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { DiscordCommand } from "../DiscordCommand";
import { categoryOption, isCommitteeMember } from "./shared";

export const updateChallengeCommand = new DiscordCommand(
    {
        name: 'update_challenge',
        description: 'Update an existing challenge',
        options: [
            {
                name: 'id',
                description: 'ID of challenge to update',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
            {
                name: 'name',
                description: 'Name of the challenge',
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: 'description',
                description: 'Description of the challenge, put a link to the challenge here',
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                ...categoryOption,
                required: false,
            },
            {
                name: 'flag',
                description: 'Flag or the challenge',
                type: ApplicationCommandOptionType.String,
                required: false,
            },
        ]
    },

    async (interaction, db) => {


        if (!isCommitteeMember(interaction)) {
            await interaction.reply({ content: 'Only committee members can update challenges!', ephemeral: true });
            return
        }

        const id = interaction.options.getNumber('id', true);

        const oldChallenge = await db.getChallenge(id);

        if (!oldChallenge) {
            await interaction.reply({ content: 'Challenge not found!', ephemeral: true });
            return;
        }

        const name = interaction.options.getString('name', false) ?? oldChallenge.name;
        const description = interaction.options.getString('description', false) ?? oldChallenge.description;
        const category = interaction.options.getString('category', false) ?? oldChallenge.category;
        const flag = interaction.options.getString('flag', false) ?? oldChallenge.flag;
        await db.updateChallenge(id, name, description, category, flag);
        await interaction.reply({ content: 'Successfully updated challenge!', ephemeral: true });
    }
);

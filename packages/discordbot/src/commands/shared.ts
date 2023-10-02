import { ApplicationCommandOptionType, ChatInputCommandInteraction, User } from "discord.js"
import { CATEGORIES, COMMITTEE_ROLE } from "shared";





export function isCommitteeMember(interaction: ChatInputCommandInteraction) {
    return (interaction.member?.roles as string[]).includes(COMMITTEE_ROLE)
}


export const categoryOption = {
    name: 'category',
    description: 'Category of the challenge',
    type: ApplicationCommandOptionType.String,
    choices: CATEGORIES,
}
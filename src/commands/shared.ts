import { ApplicationCommandOptionType } from "discord.js"


export const CATEGORIES = [
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
]


export const categoryOption = {
    name: 'category',
    description: 'Category of the challenge',
    type: ApplicationCommandOptionType.String,
    choices: CATEGORIES,
}
import { DiscordCommand } from "../DiscordCommand";
import { categoryOption } from "./shared";

export const challengesCommand = new DiscordCommand(
    {
        name: 'challenges',
        description: 'List all challenges',
        options: [
            { ...categoryOption, description: "Filter by category", required: false }
        ]
    },

    async (interaction, db) => {
        const category = interaction.options.getString('category');

        let challenges;
        if (category) {
            challenges = await db.getChallengesByCategory(category);
        } else {
            challenges = await db.getChallenges();
        }

        const answer = [] as string[];

        answer.push(`Challenge list`)




        challenges.forEach(challenge => {
            answer.push(`${challenge.name} - ${challenge.category}
\`\`\`
${challenge.description}
\`\`\`
`)
        })

        await interaction.reply({ content: answer.join('\n') });
    }
);

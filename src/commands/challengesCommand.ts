import { DiscordCommand } from "../DiscordCommand";
import { categoryOption, getSolvesByChallenge, scoringFunction } from "./shared";

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

        const solves = await db.getSolves();

        const solvesByChallenge = getSolvesByChallenge(solves)



        challenges.forEach(challenge => {
            const solves = solvesByChallenge[challenge.id] ?? 0;
            const solves_string = solves === 0 ? 'No solves' :
                solves === 1 ? '1 solve' : `${solves} solves`;

            const points = scoringFunction(solves)

            answer.push(`\`${challenge.id} \`${challenge.name} - ${challenge.category} - ${solves_string} - ${points.toFixed()} points
\`\`\`
${challenge.description}
\`\`\`
`)
        })

        await interaction.reply({ content: answer.join('\n') });
    }
);

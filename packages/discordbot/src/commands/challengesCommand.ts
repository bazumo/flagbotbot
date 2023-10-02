import { DiscordCommand } from "../DiscordCommand";
import { scoringFunction } from "shared";
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

        const solves = await db.getSolves();
        const solvesByChallenge = await db.getSolvesByChallenge()

        const solvedByUser = solves.filter(solve => solve.user.id == parseInt(interaction.user.id)).map(solve => solve.challenge.id);



        challenges.forEach(challenge => {
            const solves = solvesByChallenge[challenge.id] ?? 0;
            const solves_string = solves === 0 ? 'No solves' :
                solves === 1 ? '1 solve' : `${solves} solves`;

            const points = scoringFunction(solves)
            const hasSolved = solvedByUser.includes(challenge.id);

            answer.push(`\`${challenge.id}\` ${challenge.name} - ${challenge.category} - ${solves_string} - ${points.toFixed()} points - ${hasSolved ? '✅' : '⭕️'}
\`\`\`
${challenge.description}
\`\`\`
`)
        })

        await interaction.reply({ content: answer.join('\n'), ephemeral: true });
    }
);

import { DiscordCommand } from "../DiscordCommand";
import { calculateScore } from "./shared";


export const scoreboardCommand = new DiscordCommand(
    {
        name: 'scoreboard',
        description: 'Show the scoreboard',
    },

    async (interaction, db) => {
        const solves = await db.getSolves();
        console.log(solves);
        const scores = calculateScore(solves)
        console.log(scores)
        const sorted = scores.sort((a, b) => b.score - a.score);
        const sl = sorted.map(score => `${score.score.toFixed().padStart(4, " ")} points: ${score.user_name}`);
        await interaction.reply({ content: `\`\`\`\n${sl.join("\n")}\n\`\`\``, ephemeral: true });
    }
);

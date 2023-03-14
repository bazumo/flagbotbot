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
        const sl = scores.map(score => `${score.user_name} has ${score.score} points`);
        await interaction.reply({ content: `${sl.join("\n")}`, ephemeral: true });
    }
);

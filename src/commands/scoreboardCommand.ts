import { DiscordCommand } from "../DiscordCommand";

export const scoreboardCommand = new DiscordCommand(
    {
        name: 'scoreboard',
        description: 'Show the scoreboard',
    },

    async (interaction, db) => {
        const solves = await db.getSolves();
        console.log(solves);
        const sl = solves.map(solve => `${solve.user_name} solved ${solve.challenge_name} at <t:${new Date(solve.date).getTime() / 1000}:R>`);
        await interaction.reply({ content: `Solves: ${sl}`, ephemeral: true });
    }
);

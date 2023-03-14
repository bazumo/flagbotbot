import { DiscordCommand } from "../DiscordCommand";

export const recentSolvesCommand = new DiscordCommand(
    {
        name: 'recent_solves',
        description: 'List the recent solves',
    },

    async (interaction, db) => {
        const solves = await db.getSolves();
        console.log(solves);
        const sl = solves.map(solve => `${solve.user_name} solved ${solve.challenge_name} at <t:${new Date(solve.date).getTime() / 1000}:R>`);
        await interaction.reply({ content: `Solves: ${sl.join("\n")}`, ephemeral: true });
    }
);

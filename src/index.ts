import { REST, Routes, Client, GatewayIntentBits } from "discord.js"
import sqlite3 from 'sqlite3'
import { open } from "sqlite";
import { DB } from "./db";
import { pingCommand } from "./commands/pingCommand";
import { flagCommand } from "./commands/flagCommand";
import { scoreboardCommand } from "./commands/scoreboardCommand";
import { createChallengeCommand } from "./commands/createChallengeCommand";
import * as dotenv from 'dotenv'
import { DiscordCommand } from "./DiscordCommand";
import { challengesCommand } from "./commands/challengesCommand";


dotenv.config()

if (process.env.TOKEN == undefined) {
    throw new Error("TOKEN not set")
}
if (process.env.CLIENT_ID == undefined) {
    throw new Error("CLIENT_ID not set")
}

const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID

class Flagbotbot {

    private db: DB;
    private client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });
    private commands: DiscordCommand[] = [];

    async updateDiscordApplication() {
        const rest = new REST({ version: '10' }).setToken(TOKEN);
        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(Routes.applicationCommands(CLIENT_ID), { body: this.commands.map(cmd => cmd.description) });
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    }

    registerCommand(cmd: DiscordCommand) {
        console.log("Registering command", cmd.description.name)
        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand()) return;

            if (interaction.commandName === cmd.description.name) {
                cmd.handle(interaction, this.db)
            }
        });
    }


    constructor(db: DB, commands: DiscordCommand[]) {
        this.db = db;
        this.commands = commands;
    }

    async init() {
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user!.tag}!`);
        });

        this.commands.forEach(cmd => this.registerCommand(cmd));

        await this.updateDiscordApplication();
        await this.client.login(TOKEN);

    }
}


async function main() {
    const raw_db = await open({
        filename: 'database.db',
        driver: sqlite3.Database
    })
    const db = new DB(raw_db);

    const bot = new Flagbotbot(db, [
        pingCommand,
        flagCommand,
        scoreboardCommand,
        createChallengeCommand,
        challengesCommand
    ]);
    await bot.init();
}

main()
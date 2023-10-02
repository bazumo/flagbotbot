import { Client, GatewayIntentBits, REST, Routes, TextBasedChannel, TextChannel } from "discord.js";
import * as dotenv from 'dotenv';
import { open } from "sqlite";
import sqlite3 from 'sqlite3';
import { challengesCommand } from "./commands/challengesCommand";
import { createChallengeCommand } from "./commands/createChallengeCommand";
import { flagCommand } from "./commands/flagCommand";
import { pingCommand } from "./commands/pingCommand";
import { recentSolvesCommand } from "./commands/recentSolvesCommand";
import { scoreboardCommand } from "./commands/scoreboardCommand";
import { updateChallengeCommand } from "./commands/updateChallengeCommand";
import { DB } from "shared";
import { DiscordCommand } from "./DiscordCommand";


dotenv.config()

if (process.env.TOKEN == undefined) {
    throw new Error("TOKEN not set")
}
if (process.env.CLIENT_ID == undefined) {
    throw new Error("CLIENT_ID not set")
}

const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID
const CHANNEL_ID_ANNOUNCEMENTS = process.env.CHANNEL_ID_ANNOUNCEMENTS ?? "1084926710249689169"

export class Flagbotbot {

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
                cmd.handle(interaction, this.db, this)
            }
        });
    }


    constructor(db: DB, commands: DiscordCommand[]) {
        this.db = db;
        this.commands = commands;
    }

    async postToAnnouncements(content: string) {
        await this.postToChannel(CHANNEL_ID_ANNOUNCEMENTS, content)
    }

    async postToChannel(channel_id: string, content: string) {
        const channel = await this.client.channels.fetch(channel_id);
        if (channel == null) {
            console.error("Channel not found", channel_id)
            return
        }
        if (channel.isTextBased()) {
            (channel as TextChannel).send(content);
        }
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
        filename: '../../db/database.db',
        driver: sqlite3.Database
    })
    const db = new DB(raw_db);

    const bot = new Flagbotbot(db, [
        pingCommand,
        flagCommand,
        scoreboardCommand,
        createChallengeCommand,
        recentSolvesCommand,
        updateChallengeCommand,
        challengesCommand
    ]);
    await bot.init();
}

main()
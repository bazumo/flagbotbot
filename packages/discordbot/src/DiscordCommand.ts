import { ChatInputCommandInteraction } from "discord.js";
import { Flagbotbot } from ".";
import { DB } from "../../shared/src/db";

type InteractionHandler = (ev: ChatInputCommandInteraction, db: DB, client: Flagbotbot) => Promise<any>;

export class DiscordCommand {
    description: any;
    handler: InteractionHandler;

    constructor(description: any, handler: InteractionHandler) {
        this.description = description;
        this.handler = handler;
    }

    handle(ev: ChatInputCommandInteraction, db: DB, client: Flagbotbot) {
        console.log("Handling", this.description.name);
        this.handler(ev, db, client);
    }
}

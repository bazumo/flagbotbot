import { ChatInputCommandInteraction } from "discord.js";
import { DB } from "./db";

type InteractionHandler = (ev: ChatInputCommandInteraction, db: DB) => Promise<any>;

export class DiscordCommand {
    description: any;
    handler: InteractionHandler;

    constructor(description: any, handler: InteractionHandler) {
        this.description = description;
        this.handler = handler;
    }

    handle(ev: ChatInputCommandInteraction, db: DB) {
        console.log("Handling", this.description.name);
        this.handler(ev, db);
    }
}

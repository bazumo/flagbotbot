import { open } from "sqlite";
import sqlite3 from 'sqlite3';
import { DB } from "./db";


let saved: DB | null = null;

export async function getClient() {
    if (saved) {
        return saved;
    }
    const raw_db = await open({
        filename: './example_db/database.db',
        driver: sqlite3.Database
    })
    const db = new DB(raw_db);
    saved = db;
    return db;
}
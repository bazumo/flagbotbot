import { open } from "sqlite";
import sqlite3 from 'sqlite3';
import { DB } from "shared";


let saved: DB | null = null;

export async function getClient() {
    if (saved) {
        return saved;
    }
    const raw_db = await open({
        filename: '../../db/database.db',
        driver: sqlite3.Database
    })
    const db = new DB(raw_db);
    saved = db;
    return db;
}
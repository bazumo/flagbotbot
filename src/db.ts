import { User } from 'discord.js';
import { Database } from 'sqlite';




export class DB {

    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    async createTables() {
        await this.db.run(`
        CREATE TABLE IF NOT EXISTS challenges
        (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           name TEXT,
           description TEXT,
           category TEXT,
           flag TEXT
       );`)





        await this.db.run(`
       CREATE TABLE IF NOT EXISTS solves
       (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          challenge_id INTEGER,
          date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (challenge_id) REFERENCES challenges(id)
      )`);

        await this.db.run(`
      CREATE TABLE IF NOT EXISTS users
            (
                id INTEGER PRIMARY KEY,
                name TEXT
            );


        `);
    }

    async nuke() {
        await this.db.run(`DROP TABLE IF EXISTS challenges; `);
        await this.db.run(`DROP TABLE IF EXISTS solves;`);
        await this.db.run(`DROP TABLE IF EXISTS users;`);
    }

    async createChallenge(name: string, description: string, category: string, flag: string) {
        return this.db.run("INSERT INTO challenges (name, description, category, flag) VALUES (?, ?, ?, ?)", [name, description, category, flag]);
    }

    async updateChallenge(id: number, name: string, description: string, category: string, flag: string) {
        return this.db.run("UPDATE challenges SET name = ?, description = ?, category = ?, flag = ? WHERE id = ?", [name, description, category, flag, id]);
    }

    async ensureUser(user: User) {
        return this.db.run("INSERT OR IGNORE INTO users (id, name) VALUES (?, ?)", [user.id, user.username]);
    }

    async createSolve(user: User, flag: string,) {
        await this.ensureUser(user);
        const challenges = await this.getChallenges();
        const challenge = challenges.find(challenge => challenge.flag === flag);
        if (challenge) {
            return this.db.run("INSERT INTO solves (user_id, challenge_id) VALUES (?, ?)", [user.id, challenge.id]);
        }
    }

    getChallenges() {
        return this.db.all("SELECT * FROM challenges");
    }

    getChallenge(id: number) {
        return this.db.get("SELECT * FROM challenges WHERE id = ?", [id]);
    }

    getChallengesByCategory(cat: string) {
        return this.db.all("SELECT * FROM challenges WHERE category = ?", [cat]);
    }

    getSolves() {
        return this.db.all("SELECT users.name as user_name, challenges.name as challenge_name, date FROM solves JOIN challenges ON solves.challenge_id = challenges.id JOIN users ON solves.user_id = users.id");
    }

}
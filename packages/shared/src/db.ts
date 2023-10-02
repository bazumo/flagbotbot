import { User as DiscodUser } from 'discord.js';
import { Database } from 'sqlite';
import { PrismaClient } from '@prisma/client'
import { scoringFunction } from './util';




export class DB {

    private db: Database;
    private prisma: PrismaClient;

    constructor(db: Database) {
        this.prisma = new PrismaClient()
        this.db = db;
    }



    async createChallenge(name: string, description: string, category: string, flag: string) {
        return this.prisma.challenge.create({
            data: {
                name,
                description,
                category,
                flag
            }
        })
    }

    async updateChallenge(id: number, name: string, description: string, category: string, flag: string) {
        return this.prisma.challenge.update({
            where: {
                id
            },
            data: {
                name,
                description,
                category,
                flag
            }
        })
    }

    async ensureUser(user: DiscodUser) {
        return this.prisma.user.upsert({
            where: {
                DiscordId: user.id
            },
            update: {},
            create: {
                DiscordId: user.id,
                name: user.username
            }
        })

    }

    async hasSolve(user: DiscodUser, flag: string) {
        const solve = await this.prisma.solve.findFirst({
            where: {
                user_id: parseInt(user.id),
                challenge: {
                    flag: flag
                }
            },
            include: {
                challenge: true
            }
        });

        return Boolean(solve);
    }

    async getChallengeByFlag(flag: string) {
        const solve = await this.prisma.challenge.findFirst({
            where: {
                flag: flag
            }
        });
        return solve;
    }

    async createSolve(user: DiscodUser, flag: string) {
        await this.ensureUser(user);
        const challenge = await this.getChallengeByFlag(flag);
        if (challenge) {
            await this.prisma.solve.create({
                data: {
                    user_id: parseInt(user.id),
                    challenge_id: challenge.id
                }
            });
            return challenge;
        }
    }

    async getChallenges() {
        return this.prisma.challenge.findMany();
    }

    async getChallenge(id: number) {
        return this.prisma.challenge.findFirst({
            where: {
                id: id
            }
        });
    }

    async getChallengesByCategory(cat: string) {
        return this.prisma.challenge.findMany({
            where: {
                category: cat
            }
        });
    }

    async getRecentSolves() {
        return await this.prisma.solve.findMany({
            take: 10,
            orderBy: {
                date: 'desc'
            },
            select: {
                user: {
                    select: {
                        name: true,
                        id: true
                    }
                },
                challenge: {
                    select: {
                        name: true
                    }
                },
                date: true
            }
        });
    }

    async getSolves() {

        return this.prisma.solve.findMany({
            orderBy: {
                date: 'desc'
            },
            select: {
                user: {
                    select: {
                        name: true,
                        id: true
                    }
                },
                challenge: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                date: true
            }
        });
    }

    async getSolvesByChallengeId(id: number) {
        return this.prisma.solve.findMany({
            where: {
                challenge_id: id
            },
            orderBy: {
                date: 'desc'
            },
            select: {
                user: {
                    select: {
                        name: true,
                        id: true
                    }
                },
                challenge: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                date: true
            }
        });
    }



    async getSolvesByChallenge() {
        const solves = await this.getSolves();

        return solves.reduce<Record<number, number>>((acc, solve) => {
            if (acc[solve.challenge.id]) {
                acc[solve.challenge.id] += 1
            } else {
                acc[solve.challenge.id] = 1
            }
            return acc
        }, {})
    }


    async calculateScore() {

        // Disgusting code ahead
        const challenges = await this.getSolvesByChallenge()
        const solves = await this.getSolves();
        const users = await this.prisma.user.findMany();

        const scores = solves.reduce<Record<number, number>>((acc, solve) => {
            if (acc[solve.user.id]) {
                acc[solve.user.id] += scoringFunction(challenges[solve.challenge.id])
            } else {
                acc[solve.user.id] = scoringFunction(challenges[solve.challenge.id])
            }
            return acc
        }, {})

        return users.map(user => ({ ...user, score: scores[user.id] ?? 0 }))
    }
}
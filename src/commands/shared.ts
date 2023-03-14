import { ApplicationCommandOptionType, ChatInputCommandInteraction, User } from "discord.js"





const STRETCH = 10
const MIN_POINTS = 20
const MAX_POINTS = 100

export function scoringFunction(solves: number) {
    const e = Math.E;
    const x = (Math.max(solves, 1) - 1) / STRETCH;
    return (1 + ((-Math.pow(e, x)) / (Math.pow(e, x) + 1))) * (MAX_POINTS - MIN_POINTS) * 2 + MIN_POINTS
}



interface Solve {
    user_id: string,
    challenge_id: number,
    user_name: string,
    challenge_name: string,
    date: string,
}

export function getSolvesByChallenge(solves: Solve[]) {
    return solves.reduce<Record<string, number>>((acc, solve) => {
        if (acc[solve.challenge_id]) {
            acc[solve.challenge_id] += 1
        } else {
            acc[solve.challenge_id] = 1
        }
        return acc
    }, {})
}

export function calculateScore(solves: Solve[]) {

    // Disgusting code ahead
    const challenges = getSolvesByChallenge(solves)

    console.log(challenges)

    const scores = solves.reduce<Record<string, number>>((acc, solve) => {
        if (acc[solve.user_id]) {
            acc[solve.user_id] += scoringFunction(challenges[solve.challenge_id])
        } else {
            acc[solve.user_id] = scoringFunction(challenges[solve.challenge_id])
        }
        return acc
    }, {})

    return Object.entries(scores).map(([user_id, score]) => ({ user_id, score: score.toFixed(), user_name: solves.find(solve => solve.user_id == user_id)?.user_name }))


}


export const COMMITTEE_ROLE = "1031645550719815680"


export function isCommitteeMember(interaction: ChatInputCommandInteraction) {
    return (interaction.member?.roles as string[]).includes(COMMITTEE_ROLE)
}

export const CATEGORIES = [
    {
        name: "pwn",
        value: "pwn"
    },
    {
        name: "web",
        value: "web"
    },
    {
        name: "misc",
        value: "misc"
    },
    {
        name: "crypto",
        value: "crypto"
    },
    {
        name: "rev",
        value: "rev"
    }
]


export const categoryOption = {
    name: 'category',
    description: 'Category of the challenge',
    type: ApplicationCommandOptionType.String,
    choices: CATEGORIES,
}
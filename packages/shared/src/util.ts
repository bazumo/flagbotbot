


const STRETCH = 10
const MIN_POINTS = 20
const MAX_POINTS = 100

export function scoringFunction(solves: number) {
    const e = Math.E;
    const x = (Math.max(solves, 1) - 1) / STRETCH;
    return (1 + ((-Math.pow(e, x)) / (Math.pow(e, x) + 1))) * (MAX_POINTS - MIN_POINTS) * 2 + MIN_POINTS
}




export const COMMITTEE_ROLE = "1031645550719815680"


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

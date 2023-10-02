import { getClient } from "@/lib";
import Link from "next/link";
import { collectBy, prop } from "ramda";

const getScores = async () => {
  const client = await getClient();
  const userscore = await client.calculateScore();
  return userscore;
};

interface Challenge {
  id: number;
  name: string;
  description: string;
  category: string;
  flag: string;
}

export default async function Scoreboard() {
  const scores = (await getScores()).toSorted((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col justify-center flex-1 mx-6">
      <h1 className="text-4xl font-bold">Scoreboard</h1>
      <ul className="mt-4 space-y-2">
        {scores.map((score) => (
          <li key={score.id} className="flex min-w-[300px] justify-between">
            <div>{score.name}</div>
            <div>{score.score.toFixed(2)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

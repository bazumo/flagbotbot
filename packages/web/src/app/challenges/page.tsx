import { getClient } from "@/lib";
import Link from "next/link";
import { collectBy, prop } from "ramda";

const getChallenges = async () => {
  const client = await getClient();
  const challenges = await client.getChallenges();
  return challenges;
};

interface Challenge {
  id: number;
  name: string;
  description: string;
  category: string;
  flag: string;
}

export default async function Challenges() {
  const challenges: Challenge[] = await getChallenges();
  const byCat = collectBy(prop("category"), challenges);
  return (
    <main className="flex flex-col justify-center flex-1 mx-6">
      <div>
        <h1 className="text-4xl font-bold">Challenges</h1>
        {byCat.map((challenges, category) => (
          <div key={category} className="my-5">
            <h2>{challenges[0].category}</h2>
            <ul className="flex flex-wrap">
              {challenges.map((challenge) => (
                <li
                  key={challenge.id}
                  className="bg-green-600 min-w-[300px] m-2 p-3"
                >
                  <Link href={`/challenges/${challenge.id}`}>
                    <div>
                      <div className="text-xl">{challenge.name}</div>
                      <div>{challenge.category}</div>
                      <div>{challenge.category}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}

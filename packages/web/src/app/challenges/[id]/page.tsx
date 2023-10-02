import { getClient } from "@/lib";
import Link from "next/link";
import { collectBy, prop } from "ramda";

const getChallenge = async (id: string) => {
  const client = await getClient();
  const challenges = await client.getChallenge(parseInt(id));
  return challenges;
};

interface Challenge {
  id: number;
  name: string;
  description: string;
  category: string;
  flag: string;
}

export default async function Challenge({
  params: { id },
}: {
  params: { id: string };
}) {
  const challenge = await getChallenge(id);

  if (!challenge) {
    return <div>Challenge not found</div>;
  }
  return (
    <div>
      <h1 className="text-4xl font-bold">{challenge.name}</h1>
      <p className="mt-4">{challenge.description}</p>
      <div>
        <h3>Downloads</h3>
        <ul>
          <li></li>
        </ul>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col justify-center flex-1 mx-6">
      <h1 className="text-[10vmin] font-bold">Flagbot CTF</h1>
      <h1 className="text-[10vmin] font-bold">Challenge</h1>
      <h1 className="text-[10vmin] font-bold">2023</h1>
      <h1 className="text-[4vmin] font-bold text-orange-400">
        <Link href="/challenges">Go to challenges</Link>
      </h1>
    </main>
  );
}

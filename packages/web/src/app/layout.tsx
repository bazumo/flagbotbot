import "./globals.css";
import type { Metadata } from "next";
import { Fira_Code, VT323 } from "next/font/google";
import Image from "next/image";
import Logo from "@/app/flagbot_logo.png";
import Link from "next/link";

//const inter = VT323({ weight: "400", subsets: ["latin-ext"] });
const inter = Fira_Code({ weight: "400", subsets: ["latin-ext"] });

export const metadata: Metadata = {
  title: "Flagbot CTF challenges",
  description: "Flagbot CTF challenges",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen flex flex-col"}>
        <nav className="container mx-auto">
          <div className="p-4 flex items-center">
            <Image src={Logo} alt="Flagbot logo" width={100}></Image>
            <ul className="text-xl flex self-center ml-auto space-x-6">
              <li>
                <Link href="/challenges">Challenges</Link>
              </li>
              <li>
                <Link href="/scoreboard">Scoreboard</Link>
              </li>
            </ul>
          </div>
        </nav>
        <main className="container flex flex-col mx-auto mt-8">{children}</main>
      </body>
    </html>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  username: string;
};

type gameProps = {
  appid: number;
  name: string;
  rtime_last_played: number;
  playtime_forever: number;
};

export default function GameList({ username }: Props) {
  const [games, setGames] = useState<gameProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    async function loadGames() {
      try {
        const res = await fetch("/api/getSteamGames", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unknown error");

        setGames(data.games || []);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setGames([]);
      }
    }

    loadGames();
  }, [username]);


  if (!username) return null;

  return (
    <div className="mt-10">
      <h1 className="text-2xl text-[#e3e8f1] mb-4">Your games:</h1>
      {error && <p className="text-[#ff9f1c]">{error}</p>}
      {!error && games.length === 0 && (
        <p className="text-[#e3e8f1]">No games found or profile is private.</p>
      )}
      <ul className="space-y-4">
        {games.map((game) => (
          <li
            key={game.appid}
            className="text-[#a0b0c0] border-b pb-2 flex items-center gap-5"
          >
            <img src={`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`}
                alt={game.name}
                width={200}
                height={100}
                className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">

              </img>
            <div className=" flex flex-col justify-center">
              <a
                href={`https://store.steampowered.com/app/${game.appid}/${game.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-[#e3e8f1] hover:text-[#3da9b8]"
              >
                {game.name}
              </a>
              <p>Playtime: {(game.playtime_forever / 60).toFixed(1)} hours</p>
              <p>
                Last played:{" "}
                {game.rtime_last_played
                  ? new Date(game.rtime_last_played * 1000).toLocaleDateString()
                  : "Never"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

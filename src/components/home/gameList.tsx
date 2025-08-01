"use client";

import { useEffect, useState } from "react";

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

    async function load() {
      try {
        const res = await fetch("/api/getSteamGames", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });

        const data = await res.json();
        console.log("Response data:", data);

        if (!res.ok) throw new Error(data.error || "Unknown error");

        setGames(data.games || []);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setGames([]);
      }
    }

    load();
  }, [username]);

  if (!username) return null;

  return (
    <div className="mt-10">
      <h1 className="text-2xl text-[#e3e8f1] mb-4">Games for: {username}</h1>
      {error && <p className="text-[#ff9f1c]">{error}</p>}
      {!error && games.length === 0 && (
        <p className="text-[#e3e8f1]">No games found or profile is private.</p>
      )}
      <ul className="space-y-4">
        {games.map((game) => (
          <li key={game.appid} className="text-[#a0b0c0] border-b pb-2 grid grid-cols-2">
            <div>
                <a href={`https://steamdb.info/app/${game.appid}`} target="_blank" className="text-lg font-semibold text-[#e3e8f1]">{game.name}</a>
                <p>Playtime: {(game.playtime_forever / 60).toFixed(1)} hours</p>
                <p>
                Last played:{" "}
                {game.rtime_last_played
                    ? new Date(game.rtime_last_played * 1000).toLocaleDateString()
                    : "Never"}
                </p>
            </div>
            <div>
                <p>

                </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

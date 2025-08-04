"use client";

import { useEffect, useState } from "react";

type Props = {
  username: string;
};

type SteamGame = {
  appid: number;
  name: string;
  rtime_last_played: number;
  playtime_forever: number;
};

type IGDBGame = {
  name: string;
  summary: string;
  total_rating: number;
  first_release_date: string;
};

export default function GameList({ username }: Props) {
  const [games, setGames] = useState<(SteamGame & { igdb?: IGDBGame | null })[]>([]);
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

        const steamGames: SteamGame[] = data.games || [];


        const IgbdGames = await Promise.all(
          steamGames.map(async (game) => {
            try {
              const res = await fetch("/api/getIgdbGames", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gameName: game.name }),
              });

              const data = await res.json();
              return { ...game, igdb: data.games?.[0] || null };
            } catch {
              return { ...game, igdb: null };
            }
          })
        );

        setGames(IgbdGames);
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
    <div className="mt-8 mx-15">
      <div>
        <p className="text-[#e3e8f1] mb-5">
          Found {games.length} games for user <strong className="text-[#3da9b8]">{username}</strong>
        </p>
      </div>
      {error && <p className="text-[#ff9f1c]">{error}</p>}
      {!error && games.length === 0 && (
        <p className="text-[#e3e8f1]">No games found or profile is private.</p>
      )}
      <ul className="space-y-6">
        {games.map((game) => (
          <li
            key={game.appid}
            className="text-[#a0b0c0] border-b pb-4 flex gap-5 items-start"
          >
            <img
              src={`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`}
              alt={game.name}
              width={200}
              height={100}
              className="rounded-lg shadow-lg"
            />

            <div className="flex flex-col gap-1">
              <a
                href={`https://store.steampowered.com/app/${game.appid}`}
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

              {game.igdb && (
                <div className=" mt-2 space-y-1 text-[#a0b0c0]">
                  <p><strong className="text-[#e3e8f1]">Summary:</strong> {game.igdb.summary || "No description"}</p>
                  <p><strong className="text-[#e3e8f1]">Total Rating:</strong> {game.igdb.total_rating?.toFixed(1) || "N/A"}</p>
                  <p>
                    <strong className="text-[#e3e8f1]">Release Date:</strong>{" "}
                    {game.igdb.first_release_date
                      ? new Date(Number(game.igdb.first_release_date) * 1000).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

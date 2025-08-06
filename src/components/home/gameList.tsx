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

type SortOption = "name" | "playtime" | "rating" | "releaseDate" | "lastPlayed";
type SortDirection = "asc" | "desc";


export default function GameList({ username }: Props) {
  const [games, setGames] = useState<(SteamGame & { igdb?: IGDBGame | null })[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 });
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!username) return;

    async function loadGames() {
      try {
        setLoading(true);
        setError(null);
        setGames([]);

        const res = await fetch("/api/getSteamGames", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unknown error");

        const steamGames: SteamGame[] = data.games || [];
        
        if (steamGames.length === 0) {
          setLoading(false);
          return;
        }

        const initialGames = steamGames.map(game => ({ ...game, igdb: null }));
        setGames(initialGames);
        setLoadingProgress({ current: 0, total: steamGames.length });

        const batchSize = 15;
        const processedGames = [...initialGames];

        for (let i = 0; i < steamGames.length; i += batchSize) {
          const batch = steamGames.slice(i, i + batchSize);
          
          const batchPromises = batch.map(async (game, index) => {
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
          });

          const batchResults = await Promise.all(batchPromises);
          
          for (let j = 0; j < batchResults.length; j++) {
            processedGames[i + j] = batchResults[j];
          }
          
          setGames([...processedGames]);
          setLoadingProgress({ current: Math.min(i + batchSize, steamGames.length), total: steamGames.length });
          
  
          if (i + batchSize < steamGames.length) {
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }

        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setGames([]);
        setLoading(false);
      }
    }

    loadGames();
  }, [username]);

  if (!username) return null;
const normalize = (str: string) =>
  str.toLowerCase().replace(/[\u2122\u00AE\u00A9]/g, "").replace(/\s+/g, " ").trim();

 const filteredGames = games.filter(game => normalize(game.name).includes(normalize(searchTerm)));

const sortedGames = [...filteredGames].sort((a, b) => {
  let comparison = 0;

  switch (sortOption) {
    case "name":
      comparison = a.name.localeCompare(b.name);
      break;
    case "playtime":
      comparison = a.playtime_forever - b.playtime_forever;
      break;
    case "rating":
      comparison = (a.igdb?.total_rating || 0) - (b.igdb?.total_rating || 0);
      break;
    case "releaseDate":
      comparison = (Number(a.igdb?.first_release_date) || 0) - (Number(b.igdb?.first_release_date) || 0);
      break;
    case "lastPlayed":
      comparison = (a.rtime_last_played || 0) - (b.rtime_last_played || 0);
      break;
  }

  return sortDirection === "asc" ? comparison : -comparison;
});


  return (
    <div className="mt-8 mx-15">
      <div>
        <p className="text-[#e3e8f1] mb-5  bg-[#39455b] rounded-xl p-2">
          Found {games.length} games for user <span className="text-[#3da9b8]">{username}</span>
        </p>
      </div>
      
      {loading && (
        <div className="mb-6 p-4 bg-[#39455b] rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3da9b8]"></div>
            <span className="text-[#e3e8f1]">
              Loading game data...
            </span>
          </div>
          {loadingProgress.total > 0 && (
            <div><div className="w-full bg-[#2a3441] rounded-full h-2">
              <div
                className="bg-[#3da9b8] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(loadingProgress.current / loadingProgress.total) * 100}%` }}
              ></div>
            </div><p className="text-[#a0b0c0] text-sm mt-1">
                {loadingProgress.current} of {loadingProgress.total} processed games
              </p>
          </div>
          )}
        </div>
      )}
      
      {error && <p className="text-[#ff9f1c]">{error}</p>}
      {!error && !loading && games.length === 0 && (
        <p className="text-[#e3e8f1]">No games found or profile is private.</p>
      )}
      
<div className="mb-6 flex items-center gap-4 flex-wrap">
  <div className="flex items-center gap-2">
    <label className="text-[#e3e8f1]">Sort by:</label>
      <select
        className="bg-[#2a3441] text-[#e3e8f1] border border-[#3da9b8] rounded px-3 py-1"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value as SortOption)}
      >
        <option value="name">Name</option>
        <option value="playtime">Playtime</option>
        <option value="rating">Rating</option>
        <option value="releaseDate">Release Date</option>
        <option value="lastPlayed">Last Played</option>
      </select>

      <button
        className="text-[#3da9b8] hover:text-white px-2 py-1 border border-[#3da9b8] rounded"
        onClick={() =>
          setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
        }
      >
        {sortDirection === "asc" ? "↑ Asc" : "↓ Desc"}
      </button>
    </div>

    <input
      type="text"
      placeholder="Search game name..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="bg-[#2a3441] text-[#e3e8f1] border border-[#3da9b8] rounded px-3 py-1 mt-2 sm:mt-0"
    />
  </div>
      <ul className="space-y-6">
        {sortedGames.map((game) => (
          <li
            key={game.appid}
            className="text-[#a0b0c0] border-b pb-4 flex gap-5 items-start"
          >
            <img
              src={`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`}
              alt={game.name}
              className="rounded-lg shadow-lg w-32 sm:w-40 md:w-48 lg:w-[200px]"
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
                <div className="mt-2 space-y-1 text-[#a0b0c0]">
                  <p className="hidden lg:block">
                    <span className="text-[#e3e8f1]">Summary:</span> {game.igdb.summary || "No description"}
                  </p>
                  <p><span className="text-[#e3e8f1]">Total Rating:</span> {game.igdb.total_rating?.toFixed(1) || "N/A"}</p>
                  <p>
                    <span className="text-[#e3e8f1]">Release Date:</span>{" "}
                    {game.igdb.first_release_date
                      ? new Date(Number(game.igdb.first_release_date) * 1000).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              )}
              {!game.igdb && loading && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3da9b8]"></div>
                  <span className="text-[#a0b0c0] text-sm">Loading IGDB data...</span>
                </div>
              )}
              {!game.igdb && !loading && !error &&(
              <div className="mt-2 flex items-center gap-2 ">
                <p className="text-[#3da9b8]">No IGBD data found!</p>
              </div>
            )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

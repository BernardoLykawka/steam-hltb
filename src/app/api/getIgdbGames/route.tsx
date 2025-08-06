import { getIGDBToken } from "@/app/lib/igbd/getIgbdToken";
import redis from "@/app/lib/igbd/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { gameName } = await req.json();

    if (!gameName || typeof gameName !== "string") {
      return NextResponse.json({ error: "Nome do jogo é obrigatório" }, { status: 400 });
    }

    const normalize = (str: string) =>
      str
        .toLowerCase()
        .replace(/[\u2122\u00AE\u00A9]/g, "") // Remove ™ ® ©
        .replace(/\s+/g, " ") // extras spaces
        .trim();

    const normalizedName = normalize(gameName);
    const cacheKey = `igdb_game_search:${normalizedName}`;

    const cachedResult = await redis.get(cacheKey);
    if (cachedResult) {
      return NextResponse.json({ games: JSON.parse(cachedResult) });
    }

    const token = await getIGDBToken();

    const query = `
      fields name, summary, total_rating, first_release_date, parent_game.name;
      search "${normalizedName}";
      limit 5;
    `;

    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": process.env.TWITCH_CLIENT_ID!,
        Authorization: `Bearer ${token}`,
      },
      body: query,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro da IGDB:", errorText);
      return NextResponse.json({ error: "Erro ao buscar dados na IGDB" }, { status: 500 });
    }

    const data = await response.json();

    const bestMatch = 
      data.find((game: any) => normalize(game.name) === normalizedName) ||
      data.find((game: any) =>
      (game.parent_name || []).some(
      (alt: any) => normalize(alt.name) === normalizedName)) || data[0];
      

    await redis.setex(cacheKey, 30600, JSON.stringify([bestMatch]));

    return NextResponse.json({ games: [bestMatch] });
  } catch (err: any) {
    console.error("Erro interno:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

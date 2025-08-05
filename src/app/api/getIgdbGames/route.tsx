import { getIGDBToken } from "@/app/lib/igbd/getIgbdToken";
import redis from "@/app/lib/igbd/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { gameName } = await req.json();

    if (!gameName || typeof gameName !== 'string') {
      return NextResponse.json({ error: "Nome do jogo é obrigatório" }, { status: 400 });
    }

    const cacheKey = `igdb_game_search:${gameName.toLowerCase().trim()}`;
    
    const cachedResult = await redis.get(cacheKey);
    if (cachedResult) {
      return NextResponse.json({ games: JSON.parse(cachedResult) });
    }

    const token = await getIGDBToken();

    const query = `
      fields name, summary, total_rating, first_release_date;
      search "${gameName}";
      limit 1;
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
    
    await redis.setex(cacheKey, 30600, JSON.stringify(data));
    
    return NextResponse.json({ games: data });
  } catch (err: any) {
    console.error("Erro interno:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { getIGDBToken } from "@/app/lib/igbd/getIgbdToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { gameName } = await req.json();

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
    return NextResponse.json({ games: data });
  } catch (err: any) {
    console.error("Erro interno:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

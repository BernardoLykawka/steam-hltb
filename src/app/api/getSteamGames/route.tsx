
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { username } = await req.json();

        

        const profileRes = await fetch(username);
        const html = await profileRes.text();
        const match = html.match(/"steamid":"(\d+)"/);
        
        if (!match) return NextResponse.json({ error: "Steam ID not found" }, { status: 404 });



        const steamId = match[1];
        const apiKey = process.env.STEAM_API_KEY;
        if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

        const gameRes = await fetch(
            `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&format=json`
        );
        if (!gameRes.ok) throw new Error("Failed to fetch games");

        const data = await gameRes.json();
        return NextResponse.json({ games: data.response.games || [] });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

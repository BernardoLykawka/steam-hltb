import redis from "./redis";

export const TOKEN_KEY = "igbd:access-token";

export async function getIGDBToken(): Promise<string> {
  const cachedToken = await redis.get(TOKEN_KEY);

  if (cachedToken) {
    return cachedToken;
  }

  const clientId = process.env.TWITCH_CLIENT_ID!;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET!;

  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { 
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
    
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Erro ao obter token: " + error);
  }

  const data = await res.json();

  await redis.set(TOKEN_KEY, data.access_token, "EX", data.expires_in);

  return data.access_token;
}

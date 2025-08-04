let accessToken: string = "";
let tokenExpiration: number = 0;

export async function getIGDBToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  if (accessToken && now < tokenExpiration) {
    return accessToken;
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("TWITCH_CLIENT_ID ou TWITCH_CLIENT_SECRET não estão definidos");
  }

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

  accessToken = data.access_token;
  tokenExpiration = now + data.expires_in;

  return accessToken;
}

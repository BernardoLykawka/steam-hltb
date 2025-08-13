# Steam → IGDB Lookup

A web application built with **Next.js**, **Tailwind CSS**, and **Redis** for caching API requests. It retrieves data from the Steam API and IGDB API to display detailed information about a user's game library.

## Features

* Fetches the list of owned games from the Steam API.
* Retrieves additional game details from the IGDB API, including:

  * **Summary**
  * **Total rating**
  * **First release date**
  * **Completion time estimates (NOT DONE)** 
* Uses Redis for caching API responses to improve performance.

<img width="1895" height="856" alt="image" src="https://github.com/user-attachments/assets/0f29b9b1-29d9-4159-bdbf-c1360ccbf0f5" />
<img width="1901" height="780" alt="image" src="https://github.com/user-attachments/assets/e1d1f30a-24be-40a4-943e-401d90d46f81" />



## How It Works

1. **User Input**: Paste your Steam profile link.
2. **Steam Scraper**: Extracts the Steam ID from the profile link.
3. **Steam API Request**: Calls the `GetOwnedGames` endpoint from the Steam Web API to retrieve the user's owned games with playtime and last played data.
4. **IGDB API Request**: Calls the `/v4/games` endpoint from the IGDB API to retrieve game metadata and optional time-to-beat information.
5. **Cache Layer**: Responses are stored in Redis to avoid redundant calls.

## Tech Stack

* **Frontend**: Next.js, Tailwind CSS
* **Backend**: Node.js (API routes)
* **Cache**: Redis
* **APIs**:

  * Steam Web API
  * IGDB API

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/BernardoLykawka/steam-hltb.git
   cd steam-hltb
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env.local` file with:

   ```env
   STEAM_API_KEY=your_steam_api_key
   TWITCH_CLIENT_ID=your_twitch_client_id
   TWITCH_ACCESS_TOKEN=your_twitch_access_token
   REDIS_URL=your_redis_url
   ```
4. Run the app:

   ```bash
   npm run dev
   ```

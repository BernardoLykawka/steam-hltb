"use client";

import { useState } from "react";
import NameBox from "./nameBox";
import GameList from "./gameList";

export default function SteamSection() {
    const [username, setUsername] = useState("");

    return (
        <div className="flex flex-col items-center justify-center">
            <NameBox onSubmit={setUsername} />
            <GameList username={username} />
        </div>
    );
}

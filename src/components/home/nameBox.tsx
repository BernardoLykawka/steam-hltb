"use client";

import { useState } from "react";

type Props = {
    onSubmit: (username: string) => void;
};

export default function NameBox({ onSubmit }: Props) {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting username:", input);
        onSubmit(input);
    };

    return (
        <section>
            <form className="flex gap-4 mt-30" onSubmit={handleSubmit}>
                <input
                    className="rounded-lg px-1 text-center bg-[#39455b] shadow-2xl py-1 text-[#a0b0c0] focus:outline-none focus:ring-2 focus:ring-[#3da9b8] focus:ring-opacity-50"
                    type="text"
                    placeholder="Enter your Steam url id"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    className="rounded-lg bg-[#39455b] shadow-2xl p-1 text-[#a0b0c0] hover:cursor-pointer hover:bg-[#3da9b8]"
                >
                    Submit
                </button>
            </form>
            <div className="mt-3">
                <p>
                    https://steamcommunity.com/id/<span className="text-[#3da9b8]">gaben</span>
                </p>
            </div>
        </section>
    );
}

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
        <section className="mt-10 mb-5 text-center items-center">
            
            <form className="mt-5" onSubmit={handleSubmit}>

                <input
                    className="rounded-lg px-5 text-center bg-[#39455b] shadow-2xl py-1 text-[#a0b0c0] focus:outline-none focus:ring-2 focus:ring-[#3da9b8] focus:ring-opacity-50 justify-center mr-2" 
                    type="text"
                    placeholder="Enter your Steam url id"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    className="rounded-lg bg-[#39455b] shadow-2xl py-1 px-3 text-[#a0b0c0] hover:cursor-pointer hover:bg-[#3da9b8]"
                >
                    Submit
                </button>
                
            </form>
            
            <div className="text-[#e3e8f1]">
                <div className="my-3">
                    <a className="relative hover:cursor-pointer hover:text-[#3da9b8]" href="https://steamcommunity.com/id/boiccs" target="_blank"     rel="noopener   noreferrer ">
                        https://steamcommunity.com/id/boiccs
                    </a>
                </div>
                
                <p>
                    Verify if your Steam profile is <span className="mt-4 text-[#3da9b8]">public</span> and if the games are visible.
                 </p>
            </div>
        </section>
    );
}

import { GithubLogoIcon } from '@phosphor-icons/react/dist/ssr'

export default function Header() {
    return (
        <header className="bg-[#2f3f5a] text-[#e3e8f1] grid grid-cols-1 lg:grid-cols-3">
            <div>

            </div>
            <div className=" p-6 flex flex-col lg:items-center">
                <h1 className="font-title text-4xl text-[#e3e8f1] text-justify font-bold tracking-tight mb-2">
                STEAM TIME OPTIMIZER
            </h1>
            <p className="text-[#b0bed0] text-lg text-justify ">
                Maximize your gaming experience and manage your playtime efficiently.
            </p>
            </div>
            <div className="flex justify-start items-center lg:pt-6 pb-6 pl-6">
                <a href="https://github.com/BernardoLykawka/steam-hltb " target="_blank" rel="noopener noreferrer" className=" justify-center items-center">
                    <GithubLogoIcon size={40} weight="fill" className='hover:cursor-pointer hover:text-[#3da9b8] '/>  
                </a>
            </div>  
        </header>
    );
}
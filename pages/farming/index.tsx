// Components (External)
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// Components (Internal)
import RoomCard from 'components/RoomCard';
import svg from '../../public/logos/infinex-logo.svg';


const Farming: NextPage = () => {

   const rooms = [
      {key: 1, name: "Binance Forecourt", description: "Stake BNB Tokens Earn Voting Power", emoji: "⛲"},
      {key: 2, name: "Binance Forecourt", description: "Stake BNB Tokens Earn Voting Power", emoji: "⛲"},
      {key: 3, name: "Binance Forecourt", description: "Stake BNB Tokens Earn Voting Power", emoji: "⛲"},
      {key: 4, name: "Binance Forecourt", description: "Stake BNB Tokens Earn Voting Power", emoji: "⛲"},
      {key: 5, name: "Binance Forecourt", description: "Stake BNB Tokens Earn Voting Power", emoji: "⛲"},
      {key: 6, name: "Binance Forecourt", description: "Stake BNB Tokens Earn Voting Power", emoji: "⛲"},
      {key: 7, name: "Binance Forecourt", description: "Stake BNB Tokens Earn Voting Power", emoji: "⛲"},
      {key: 8, name: "Binance Forecourt", description: "Stake BNB Tokens Earn Voting Power", emoji: "⛲"},
      {key: 9, name: "Binance Forecourt", description: "Stake BNB Tokens Earn Voting Power", emoji: "⛲"},  
      {key: 10, name: "FTX Panic Room", description: "Deposit FTT, Earn Voting Power", emoji: "🫣"},  
   ]

	return (
      <main className="bg-primary-light px-3 py-6 min-h-[90vh] farming-background bg-repeat-y bg-center text-black">
         <div className="flex flex-col justify-center items-center w-full max-w-xs mx-auto">
            <Image src={svg} alt="Infinex Logo" height={53} className="mx-auto"/>
            <h1 className="text-5xl font-bold text-center mt-[-40px]">👨🏻‍⚖️</h1>
            <h1 className="text-center text-xl font-bold text-black">Select a room in the mansion</h1>
            <p className="text-center text-xs font-normal">Earn Infinex voting power by depositing your tokens and proving your trade history</p>
         </div>
         <div className="flex flex-col container mt-4">
            <div className="flex flex-wrap justify-center w-full gap-3 max-w-2xl mx-auto">
               {rooms?.map((room: any) => (
                  <Link href={`/farming/${room.name}`} key={room.key}>
                     <RoomCard
                        key={room.key}
                        name={room.name}
                        description={room.description}
                        emoji={room.emoji}
                     />
                  </Link>
               ))}
            </div>    
         </div>
      </main>
	);
};

export default Farming;
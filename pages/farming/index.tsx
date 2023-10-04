// Components (External)
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// Components (Internal)
import RoomCard from 'components/RoomCard';
import svg from '../../public/logos/infinex-logo.svg';

 // Hooks (Internal)
import useUserFarmingQuery, { GetFarmingData } from 'queries/farming/useUserFarmingQuery';


const Farming: NextPage = () => {

	const userFarmingQuery = useUserFarmingQuery(); //TODO maybe take this away


   const rooms = [
      {key: 1, name: "Binance Forecourt", description: "Deposit BNB, Earn Voting Power", emoji: "⛲", token: "BNB", exhange_id: "Binance"},
      {key: 2, name: "FTX Panic Room", description: "Deposit FTT, Earn Voting Power", emoji: "🫣", token: "FTT", exhange_id: "FTX"},
      {key: 3, name: "Kucoin Scullery", description: "Deposit KCS, Earn Voting Power", emoji: "🛖", token: "KCS", exhange_id: "Kucoin"},
      {key: 4, name: "His Excellency’s Chambers", description: "Deposit HT, Earn Voting Power", emoji: "🧖‍♂️", token: "HT", exhange_id: "Huobi"},
      {key: 5, name: "Bitmex Ballroom", description: "Deposit BMEX, Earn Voting Power", emoji: "💃", token: "BMEX", exhange_id: "Bitmex"},
      {key: 6, name: "Dydx Observatory", description: "Deposit DYDX, Earn Voting Power", emoji: "🔭", token: "DYDX", exhange_id: "Dydx"},
      {key: 7, name: "Blueberry fields", description: "Deposit GMX, Earn Voting Power", emoji: "🫐", token: "GMX", exhange_id: "GMX"},
      {key: 8, name: "Bybit Pillow Chamber", description: "Deposit MNT, Earn Voting Power", emoji: "🌖", token: "MNT", exhange_id: "Bybit"},
      {key: 9, name: "OKX Pitstop", description: "Deposit OKB, Earn Voting Power", emoji: "🏁", token: "OKB", exhange_id: "OKX"},
      {key: 10, name: "The Bitget Laundromat", description: "Deposit BGB, Earn Voting Power", emoji: "🧺", token: "BGB", exhange_id: "Bitget"},
      {key: 11, name: "??", description: "Deposit MX, Earn Voting Power", emoji: "??", token: "MX", exhange_id: "MEXC"},
      {key: 12, name: "Kraken Quarters", description: "Link your API keys, Earn Voting Power", emoji: "🐙", token: "", exhange_id: "Kraken"},
      {key: 13, name: "Spot Dex Sauna", description: "Connect your address, Earn Voting Power", emoji: "❤️‍🔥", token: "", exhange_id: "Spot Dex"},
      {key: 14, name: "Spartan Grounds", description: "Connect your address, Earn Voting Power", emoji: "⚔️", token: "", exhange_id: "SNX"}
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
                        exchange_id={room.exhange_id}
                        token={room.token}
                     />
                  </Link>
               ))}
            </div>    
         </div>
      </main>
	);
};

export default Farming;
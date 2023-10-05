// Components (External)
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';


// Components (Internal)
import rooms from '../../utils/config/rooms';
import RoomCard from 'components/RoomCard';
import svg from '../../public/logos/infinex-logo.svg';

 // Hooks (Internal)
import { useConnectorContext } from 'containers/Connector';


const Farming: NextPage = () => {

   const { connectWallet, isWalletConnected } = useConnectorContext();

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
                  <>
                  {isWalletConnected ? (
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
                  ) : (
                     <div onClick={connectWallet}>
                        <RoomCard
                           key={room.key}
                           name={room.name}
                           description={room.description}
                           emoji={room.emoji}
                           exchange_id={room.exhange_id}
                           token={room.token}
                           />
                     </div>
                  )}
               </>
               ))}
            </div>    
         </div>
      </main>
	);
};

export default Farming;
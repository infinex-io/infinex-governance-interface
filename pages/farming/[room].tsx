// Components (Internal)
import LockIcon from 'components/Icons/LockIcon';
import CompleteIcon from 'components/Icons/CompleteIcon';
import BackIcon from 'components/Icons/BackIcon';
import LockingScreen from 'components/LockingRoom/LockingScreen';
import LinkingScreen from 'components/LockingRoom/LinkingScreen';
import rooms from '../../utils/config/rooms';
// Components (External)
import Head from 'next/head';

// Hooks
import { useState } from 'react';
import { useRouter } from 'next/router';
import FTXFileUpload from 'components/FTXFileUpload';

// Hooks (External)
import useUserFarmingQuery from 'queries/farming/useUserFarmingQuery';


// Interfaces
export interface Room {
   name: string;
   description: string;
   emoji: string;
   token: string;
   exchange_id: string;
}

export default function Room() {

   /* ================================== state ================================== */
   const [userAccount, setUserAccount] = useState({
      tokensLocked: 0,
      tokensAvailable: 2000,
      tradingVolume: 200,
      governancePower: 1233,
      })

   const router = useRouter();
   const room = rooms.find(r => r.name === router.query.room);

   /* ================================== hooks ================================== */

   const userFarmingQuery = useUserFarmingQuery();

   if (userFarmingQuery.isLoading) return <div>Loading...</div>

   // TODO: Make sure that for this page we're being passed through a identifier of the room
   // TODO: Check the volume against that specific piece of data
   if (!room) {
      return <div>Loading...</div>
   }
   
	return (
      <>
         <Head>
            <title>Infinex | Governance V3</title>
         </Head>
         <div className="flex flex-col">
            <div className="flex flex-col justify-center items-center bg-primary-light w-full p-10 gap-2">
               <h1 className="text-black text-5xl font-black text-center">{room.emoji} {room.name}</h1>
               <p className="text-black text-base font-bold">Prove usership</p>
               <p className="text-black text-base font-bold">Earn voting power</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between">
               <div className="w-full sm:w-1/2">
                  <LockingScreen 
                     room={room}
                  />
               </div>
               <div className="w-full sm:w-1/2">
                  {
                     router.query.room === "FTX Panic Room" ?
                     <FTXFileUpload />
                     :
                     <LinkingScreen
                        userAccount={userAccount}
                     />
                  }
               </div>
            </div>
         </div>
      </>
   );
}
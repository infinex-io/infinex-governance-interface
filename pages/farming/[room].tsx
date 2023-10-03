// Components (Internal)
import LockIcon from 'components/Icons/LockIcon';
import CompleteIcon from 'components/Icons/CompleteIcon';
import BackIcon from 'components/Icons/BackIcon';
import LockingScreen from 'components/LockingRoom/LockingScreen';
import LinkingScreen from 'components/LockingRoom/LinkingScreen';

// Components (External)
import Head from 'next/head';

// Hooks
import { useState } from 'react';
import { useRouter } from 'next/router';

// Hooks (External)
import useUserFarmingQuery, { GetFarmingData } from 'queries/farming/useUserFarmingQuery';


export default function Room() {

   /* ================================== state ================================== */
   const [userAccount, setUserAccount] = useState({
      tokensLocked: 0,
      tokensAvailable: 2000,
      tradingVolume: 200,
      governancePower: 1233,
      })

   /* ================================== hooks ================================== */

   const room = {name: "Binance Forecourt", description: "Stake BNB Tokens Earn Voting Power", emoji: "⛲"} 
   const userVolumeQuery = useUserFarmingQuery("0xa169e0081a995fbd9ef5c156df93add9680f6029");

   if (userVolumeQuery.isLoading) return <div>Loading...</div>

   // TODO: Make sure that for this page we're being passed through a identifier of the room
   // TODO: Check the volume against that specific piece of data

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
                     userAccount={userAccount} 
                  />
               </div>
               <div className="w-full sm:w-1/2">
                  <LinkingScreen 
                     userAccount={userAccount}
                  />
               </div>
            </div>
        </div>
		</>
	);
}
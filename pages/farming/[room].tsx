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
import FTXFileUpload from 'components/FTXFileUpload';



/**
   Todo
   - [ ] Make getting room dynamic
   - [ ] I18n
   - [ ] Add query for userAccount
   - [ ] Add query for staking 
 */


export default function Room() {
   const room = { name: "Binance Forecourt", description: "Stake BNB Tokens Earn Voting Power", emoji: "⛲" }

   /* ================================== state ================================== */
   const [userAccount, setUserAccount] = useState({
      tokensLocked: 0,
      tokensAvailable: 2000,
      tradingVolume: 200,
      governancePower: 1233,
   })
   const [locking, setLocking] = useState(false)
   const [completed, setCompleted] = useState(false)
   const [inputValue, setInputValue] = useState("");

   /* ================================== hooks ================================== */
   const router = useRouter();
   console.log(router.query.room)

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
                     completed={completed}
                     userAccount={userAccount}
                     locking={locking}
                     inputValue={inputValue}
                     setLocking={setLocking}
                     setCompleted={setCompleted}
                     setInputValue={setInputValue}
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
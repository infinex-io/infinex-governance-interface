// Libraries
import React from 'react';

// Components (Internal)
import LockIcon from 'components/Icons/LockIcon';
import CompleteIcon from 'components/Icons/CompleteIcon';
import BackIcon from 'components/Icons/BackIcon';

// Components (External)
import { Button } from "@chakra-ui/react";

// Hooks (Exteneral)
import { useRouter } from 'next/router';
import {
   useEffect
} from 'react';
import { toast } from 'react-toastify';


// Hooks (Internal)
import useUserFarmingQuery from 'queries/farming/useUserFarmingQuery';
import { useConnectorContext } from 'containers/Connector/Connector';
import useStakeTokenMutation from 'mutations/farming/useStakeTokenMutation';

// Interfaces
import { Room } from 'pages/farming/[room]';

const LockingScreen: React.FC<{room: Room}> = ({room}) => {

   /* ================================== state ================================== */
   const [status, setStatus] = React.useState("none") // "none" || "locking" || "completed"
   const [inputValue, setInputValue] = React.useState("")
   
   /* ================================== hooks ================================== */
   const router = useRouter();
   const { walletAddress } = useConnectorContext();
   const userFarmingQuery = useUserFarmingQuery(); 
   const stakeTokenMutation = useStakeTokenMutation();
   const [loading, setLoading] = React.useState(false)
   const [amountLocked, setAmountLocked] = React.useState(0)
   
   /* ================================== Effects ================================== */
   useEffect(() => {
      if (walletAddress){
         userFarmingQuery.refetch()
      }
   }, [walletAddress]);

   useEffect(() => {
      
      const amount = userFarmingQuery.data?.staking[`${room.token}_amount_locked`] as number
      setAmountLocked(amount)
      amount > 0 ? setStatus('locked') : ''

      setLoading(false)
      
   }, [userFarmingQuery]);

   function handleStake(){
      if (Number(inputValue) <= 0) {
         toast.error("Input must be greater than 0");
         return;
      }
      setLoading(true);
      const overide = amountLocked !== undefined && amountLocked > 0;
      stakeTokenMutation.mutate({
         token: room.token.toLowerCase(),
         amount: Number(inputValue),
         overide: overide
      }, {
         onSettled: (data, error, variables, context) => {
            if (error){
               setLoading(false);
               toast.error(JSON.stringify(error));
            }else{
               setStatus("completed");
               setLoading(false);
               userFarmingQuery.refetch()
            }
         }
      });
   }
   
   return (
      <div className="px-8 sm:px-0 flex flex-col justify-center items-center bg-primary gap-10 text-black " style={{height: 'calc(100vh - 257px)'}}>
         {/* Icon */}
         {status === "completed" ? 
            <LockIcon width={26} height={35} /> 
            : 
            <CompleteIcon width={33} height={33}/>
         }
         
         {/* Title [Lock, Locked] */}
         <h1 className="tg-title-h1 text-5xl font-black text-black">{status === "completed" || status === "locked" 
               ? 
            `Locked ${room ? room.token : ""}` 
               : 
            `Lock ${room ? room.token : ""}`}
         </h1>

         {
            (amountLocked > 0) &&
               <div className="flex flex-col justify-center items-center">
                  <p className="text-sm font-bold">Locked tokens:</p>    
                  <p className="text-base font-black">{room ? amountLocked : ""}</p>
               </div>
         }
         
         {/* description */}
         <p className="text-sm font-medium text-center max-w-sm">
            {status === "completed" ?
               `You’ve successfully locked your tokens.`
               :
               "You cannot move those tokens until the end of the farming period, otherwise you will lose points."
            }
         </p>

         {(status != "none") &&
            <div className="flex flex-row items-center gap-10">
               {  
                  (amountLocked == 0) &&
                     <div className="flex flex-col justify-center items-center">
                        <p className="text-sm font-bold">Locked tokens:</p>    
                        <p className="text-base font-black">{room ? amountLocked : ""}</p>
                     </div>
               }
               
               {
                  status != "completed" && status != "locked" &&
                  <div className="flex flex-col justify-center items-center">
                     <p className="text-sm font-bold">Available tokens:</p>    
                     <p className="text-base font-black">{userFarmingQuery.data?.staking[`${room.token}_available`] ? userFarmingQuery.data?.staking[`${room.token}_available`] : 0}</p>
                  </div> 
               }
            </div>
         }

          {/* Lock (block, hidden - lockingState) */}
         {status === "none" && (amountLocked == 0 || !amountLocked) &&
            <button 
               className="text-white bg-black rounded-sm py-2 px-4"
               onClick={() => setStatus("locking")}
            >Lock</button>
         }

         {/* Todo add override stake */}
         {status === "none" && amountLocked == 0 &&
            <button 
               className="text-white bg-black rounded-sm py-2 px-4"
               onClick={() => setStatus("locking")}
            >Update lock</button>
         }
         
         {status === "locking" && 
            <div className="relative max-w-xs w-full ">
               <p className="absolute top-0 text-xs font-black">AMOUNT</p>
               <div className="mt-5 relative">
                  <input 
                     type='number'
                     className="border bg-primary border-black placeholder-black focus:outline-none text-black rounded-sm py-2 pr-16 pl-4 w-full" 
                     placeholder="Enter amount"
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     disabled={loading}
                  />
                  <button 
                     className="absolute bg-primaryDark bg-opacity-30 right-2 top-1/2 transform -translate-y-1/2 text-xs font-black rounded-sm py-1 px-2"
                     onClick={() => setInputValue(userFarmingQuery.data?.staking[`${room.token}_available`].toString() ?? "0")}
                  >Max</button>
               </div>
            </div>
         }

         {/* (hidden, unhidden - lockingState) */}
         {status === "locking" &&
            <div className="flex flex-row gap-4">
               {/* Backicon + Text */}
               <button 
                  className="text-black bg-none rounded-sm py-2 px-4 border border-black flex items-center gap-2"
                  disabled={loading}
                  onClick={() => {
                     setStatus("none")
                  }}
               >
                  <BackIcon width={10} height={10} />
                  <span>Back</span>
               </button>
               {/* Button */}
               <Button 
                  variant="custom"
                  height="42px"
                  className="text-white bg-black !rounded-sm py-2 px-4"
                  onClick={() => {
                     handleStake()
                   }
                  }
                  disabled={loading}
                  isLoading={loading}
               >Lock tokens</Button>
            </div>
         }
         {status === "completed" &&
            <div className="flex flex-row gap-4">
               {/* Backicon + Text */}
               {/* <button 
                  className="text-black bg-none rounded-sm py-2 px-4 border border-black flex items-center gap-2"
                  onClick={() => {
                     setStatus("locking")
                  }
                  }
               >
                  Lock more
               </button> */}
               {/* Button */}
               <button 
                  className="text-white bg-black rounded-sm py-2 px-4"
                  onClick={() => {
                     router.push("/farming")
                   }
                  }
               >Done</button>
            </div>
         }
      </div>
   );
}

export default LockingScreen;
// Libraries
import React from 'react';

// Components (Internal)
import LockIcon from 'components/Icons/LockIcon';
import CompleteIcon from 'components/Icons/CompleteIcon';
import BackIcon from 'components/Icons/BackIcon';

// Hooks (Exteneral)
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';

// Interfaces
interface UserAccount {
  tokensLocked: number;
  tokensAvailable: number;
}
interface LockingComponentProps {
  userAccount: UserAccount;
}

const LockingScreen: React.FC<LockingComponentProps> = ({ userAccount }) => {

   /* ================================== state ================================== */
   const [status, setStatus] = React.useState("none") // "none" || "locking" || "completed"
   const [inputValue, setInputValue] = React.useState("")
   
   /* ================================== hooks ================================== */
   const router = useRouter();

   return (
      <div className="px-8 sm:px-0 flex flex-col justify-center items-center bg-primary gap-10 text-black " style={{height: 'calc(100vh - 257px)'}}>
         {/* Icon */}
         {status === "completed" ? 
            <LockIcon width={26} height={35} /> 
            : 
            <CompleteIcon width={33} height={33}/>
         }
         
         {/* Title [Lock, Locked] */}
         <h1 className="text-black text-5xl font-black">{status === "completed" ? "Locked" : "Lock"}</h1>
         
         {/* description */}
         <p className="text-sm font-medium text-center max-w-sm">
            {status === "completed" ?
               `You’ve successfully locked ${userAccount.tokensLocked} tokens.`
               :
               "You cannot move those tokens until the end of the farming period, otherwise you will lose points."
            }
         </p>
         
         {/* Lock (block, hidden - lockingState) */}
         {status === "none" &&
            <button 
               className="text-white bg-black rounded-sm py-2 px-4"
               onClick={() => setStatus("locking")}
            >Lock</button>
         }

         {(status) &&
            <div className="flex flex-row items-center gap-10">
               {userAccount.tokensLocked > 0 &&
                  <div className="flex flex-col justify-center items-center">
                     <p className="text-sm font-bold">Locked tokens:</p>    
                     <p className="text-base font-black">{userAccount.tokensLocked}</p>
                  </div>
               }
               
               <div className="flex flex-col justify-center items-center">
                  <p className="text-sm font-bold">Available tokens:</p>    
                  <p className="text-base font-black">{userAccount.tokensAvailable}</p>
               </div>
            </div>
         }
         
         {status === "locking" && 
            <div className="relative max-w-xs w-full ">
               <p className="absolute top-0 text-xs font-black">AMOUNT</p>
               <div className="mt-5 relative">
                  <input 
                     type="text" 
                     className="border bg-primary border-black text-black rounded-sm py-2 pr-16 pl-4 w-full" 
                     placeholder="Enter amount"
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button 
                     className="absolute bg-primaryDark bg-opacity-30 right-2 top-1/2 transform -translate-y-1/2 text-xs font-black rounded-sm py-1 px-2"
                     onClick={() => setInputValue(userAccount.tokensAvailable.toString())}
                  >Max</button>
               </div>
            </div>
         }

         {/* (hidden, unhidden - lockingState) */}
         {status === "locking" &&
            <div className="flex flex-row gap-4">
               {/* Backicon + Text */}
               <button className="text-black bg-none rounded-sm py-2 px-4 border border-black flex items-center gap-2">
                  <BackIcon width={10} height={10} />
                  <span>Back</span>
               </button>
               {/* Button */}
               <button 
                  className="text-white bg-black rounded-sm py-2 px-4"
                  onClick={() => {
                     setStatus("completed")
                   }
                  }
               >Lock tokens</button>
            </div>
         }
         {status === "completed" &&
            <div className="flex flex-row gap-4">
               {/* Backicon + Text */}
               <button 
                  className="text-black bg-none rounded-sm py-2 px-4 border border-black flex items-center gap-2"
                  onClick={() => {
                     setStatus("locking")
                  }
                  }
               >
                  Lock more
               </button>
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
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
  completed: boolean;
  userAccount: UserAccount;
  locking: boolean;
  inputValue: string;
  setLocking: Dispatch<SetStateAction<boolean>>;
  setCompleted: Dispatch<SetStateAction<boolean>>;
  setInputValue: Dispatch<SetStateAction<string>>;
}

const LockingScreen: React.FC<LockingComponentProps> = ({ completed, userAccount, locking, inputValue, setLocking, setCompleted, setInputValue }) => {
   const router = useRouter();

   return (
      <div className="px-8 sm:px-0 flex flex-col justify-center items-center bg-primary gap-10 text-black " style={{height: 'calc(100vh - 257px)'}}>
         {/* Icon */}
         {completed ? 
            <LockIcon width={26} height={35} /> 
            : 
            <CompleteIcon width={33} height={33}/>
         }
         
         {/* Title [Lock, Locked] */}
         <h1 className="text-black text-5xl font-black">{completed ? "Locked" : "Lock"}</h1>
         
         {/* description */}
         <p className="text-sm font-medium text-center max-w-sm">
            {completed ?
               `You’ve successfully locked ${userAccount.tokensLocked} tokens.`
               :
               "You cannot move those tokens until the end of the farming period, otherwise you will lose points."
            }
         </p>
         
         {/* Lock (block, hidden - lockingState) */}
         {!locking && !completed &&
            <button 
               className="text-white bg-black rounded-sm py-2 px-4"
               onClick={() => setLocking(true)}
            >Lock</button>
         }

         {(locking || completed) &&
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
         
         {locking && 
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
         {locking &&
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
                     setCompleted(true)
                     setLocking(false)
                   }
                  }
               >Lock tokens</button>
            </div>
         }
         {completed &&
            <div className="flex flex-row gap-4">
               {/* Backicon + Text */}
               <button 
                  className="text-black bg-none rounded-sm py-2 px-4 border border-black flex items-center gap-2"
                  onClick={() => {
                     setLocking(true)
                     setCompleted(false)
                  }
                  }
               >
                  Learn more
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
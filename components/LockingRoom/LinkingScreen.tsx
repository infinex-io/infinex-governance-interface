// Libraries
import React from 'react';

// Components (Internal)
import LinkIcon from 'components/Icons/LinkIcon';
import BackIcon from 'components/Icons/BackIcon';
import CompleteIcon from 'components/Icons/CompleteIcon';

// Hooks (Exteneral)
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';

// Internal
import { useConnectorContext } from 'containers/Connector';
import { Room } from 'pages/farming/[room]';

const LinkingScreen: React.FC<{room: Room}> = ({room}) => {
   /* ================================== state ================================== */
   const [status, setStatus] = React.useState("none") // none || linking || waiting || completed
   const [publicKey, setPublicKey] = React.useState("") 
   const [secretKey, setSecretKey] = React.useState("")

   /* ================================== hooks ================================== */
   const router = useRouter();

   /* ================================== functions ================================== */
   async function handleSubmit() {
      setStatus("waiting")

      useLinkExchangeMutations
      

   }

   return (
     <div className="px-8 sm:px-0 flex flex-col justify-center items-center bg-surface gap-10 text-white " style={{height: 'calc(100vh - 256px)'}}>
         {/* Icon (Link || completion || waiting(add spinner)) */}
         {(status === "none" || status === "linking") && <LinkIcon />}
         {(status === "linked" || status === "waiting") && <CompleteIcon />}
         {/* Title (link) */}
         <h1 className="tg-title-h1 text-white text-5xl font-black">
            {status === "none" ? "Link" : "Linked"}
         </h1>
         {/* description (link your api keys || Your api keys may take some time) */}
         <h2 className="text-sm font-medium text-white text-center max-w-sm"> 
            {status === "none" && "Link your API keys"}
            {status === "linking" || status === "waiting" &&  "Your API data may take some time to update, Check back in ~10 mins."}
            {status === "linked" && "API keys linked"}
         </h2>
         {/* Link button (hide when linking) */}
         {status === "none" &&
            <button 
               className="text-black bg-primary rounded-sm py-2 px-4"
               onClick={() => setStatus("linking")}
            >
               Link
            </button>
         }
         {status === "waiting" &&
            <button 
               className="text-black bg-primary rounded-sm py-2 px-4"
               onClick={() => {
                     router.push("/farming")
                   }
               }
            >
               Done
            </button>
         }
          {status === "linking" && 
            <>
               <div className="relative max-w-xs w-full ">
                  <p className="absolute top-0 text-xs text-white">API PUBLIC</p>
                  <div className="mt-5 relative">
                     <input 
                        type="text" 
                        className="border bg-surface border-slate-700 text-white rounded-sm py-2 pr-16 pl-4 w-full" 
                        placeholder="API Public"
                        value={publicKey}
                        onChange={(e) => setPublicKey(e.target.value)}
                     />
                  </div>
               </div>
               <div className="relative max-w-xs w-full mt-[-15px]">
                  <p className="absolute top-0 text-xs text-white">API PUBLIC</p>
                  <div className="mt-5 relative">
                     <input 
                        type="text" 
                        className="border bg-surface border-slate-700 text-white rounded-sm py-2 pr-16 pl-4 w-full" 
                        placeholder="API Secret"
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        />
                  </div>
               </div>
            </>
         }
        {status === "linking" &&
            <div className="flex flex-row gap-4">
               {/* Backicon + Text */}
               <button 
                  className="text-white bg-surface rounded-sm py-2 px-4 border border-white flex items-center gap-2"
                  onClick={() => setStatus("none")}
               >
                  <BackIcon width={10} height={10} />
                  <span>Back</span>
               </button>
               {/* Button */}
               <button 
                  className="text-black bg-primary rounded-sm py-2 px-4"
                  onClick={() => {
                     handleSubmit()
                   }
                  }
               >Submit</button>
            </div>
         }
         {status === "linked" &&
            <div className="flex flex-row items-center gap-10">
               <div className="flex flex-col justify-center items-center">
                  <p className="text-sm font-bold">Locked tokens:</p>    
                  <p className="text-base font-black">{userAccount.tradingVolume}</p>
               </div>
               
               <div className="flex flex-col justify-center items-center">
                  <p className="text-sm font-bold">Available tokens:</p>    
                  <p className="text-base font-black">{userAccount.governancePower}</p>
               </div>
            </div>
         }
          {status === "linked" &&
            <div className="flex flex-row gap-4">
               {/* Backicon + Text */}
               <button 
                  className="text-white bg-surface rounded-sm py-2 px-4 border border-white flex items-center gap-2"
                  onClick={() => setStatus("none")}
               >
                  <BackIcon width={10} height={10} />
                  <span>Back</span>
               </button>
               {/* Button */}
               <button 
                  className="text-black bg-primary rounded-sm py-2 px-4"
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

export default LinkingScreen;
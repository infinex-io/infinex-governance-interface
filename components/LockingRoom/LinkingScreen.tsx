// Libraries
import React, { useEffect } from 'react';
import { Button } from "@chakra-ui/react";

// Components (Internal)
import LinkIcon from 'components/Icons/LinkIcon';
import BackIcon from 'components/Icons/BackIcon';
import CompleteIcon from 'components/Icons/CompleteIcon';

// Components (External)
import { toast } from 'react-toastify';

// Hooks (Exteneral)
import { useRouter } from 'next/router';

// Hooks (Internal)
import useLinkExchangeMutations from 'mutations/farming/useLinkExchangeMutations';
import useUserFarmingQuery from 'queries/farming/useUserFarmingQuery';

// Internal
import { Room } from 'pages/farming/[room]';

const LinkingScreen: React.FC<{room: Room}> = ({room}) => {
   /* ================================== state ================================== */
   const [status, setStatus] = React.useState("none") // none || linking || waiting || completed
   const [publicKey, setPublicKey] = React.useState("")
   const [secretKey, setSecretKey] = React.useState("")
   const [isLoading, setLoading] = React.useState(false)
   const [volume, setVolume] = React.useState(0)

   /* ================================== hooks ================================== */
   const router = useRouter();
   const linkExchangeMutation = useLinkExchangeMutations();
   const userFarmingQuery = useUserFarmingQuery();

   /* ================================== useEffect ================================== */
   useEffect(() => {
      if (userFarmingQuery.data){
         console.log("farming data", userFarmingQuery.data)
         if (Number(userFarmingQuery.data.volume[room.exchange_id]) > 0){
            setVolume(Number(userFarmingQuery.data.volume[room.exchange_id]))
            setStatus("completed")
         }else{
            setStatus("none")
         }
         if (userFarmingQuery.data.staking[`${room.token}_status`] === "pending"){ // TODO: Switch this to whatever the state is meant to be
            setStatus("waiting")
         }
      }

   },[userFarmingQuery.data])
   /* ================================== functions ================================== */
   async function handleSubmit() {
      setLoading(true);
      linkExchangeMutation.mutate({
         exchange: room.exchange_id,
         api_key: publicKey,
         secret_key: secretKey,
         type: room.type
      }, {
            onSettled: (data, error, variables, context) => {
               if (error){
                  setStatus("linking")
                  setLoading(false);
                  toast.error(JSON.stringify(error));
               }else{
                  setStatus("waiting");
                  setLoading(false);
                  userFarmingQuery.refetch()
               }
            }
         });
   }

   return (
     <div className="px-8 sm:px-0 flex flex-col justify-center items-center bg-surface gap-10 text-white " style={{height: 'calc(100vh - 256px)'}}>
         {/* Icon (Link || completion || waiting(add spinner)) */}
         {(status === "none" || status === "linking") && <LinkIcon />}
         {(status === "completed" || status === "waiting") && <CompleteIcon />}
         {/* Title (link) */}
         <h1 className="tg-title-h1 text-white text-5xl font-black">
            {status === "none" ? "Link" : "Completed"}
         </h1>
         {/* description (link your api keys || Your api keys may take some time) */}
         <h2 className="text-sm font-medium text-white text-center max-w-sm">
            {status === "none" && "Link your API keys"}
            {status === "linking" || status === "waiting" &&  "Your API data may take some time to update, Check back in ~20 mins."}
            {status === "completed" && "API keys completed"}
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
                  <p className="absolute top-0 text-xs text-white">API SECRET</p>
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
        {(status === "linking") &&
            <div className="flex flex-row gap-4">
               {/* Backicon + Text */}
               <button
                  className="text-white bg-surface rounded-sm py-2 px-4 border border-white flex items-center gap-2"
                  onClick={() => setStatus("none")}
                  disabled={isLoading}
               >
                  <BackIcon width={10} height={10} />
                  <span>Back</span>
               </button>
               {/* Button */}
               <Button
                  height="42px"
                  isLoading={isLoading}
                  loadingText='Submitting'
                  className="!text-black !bg-primary !rounded-sm !py-2 !px-4"
                  background="primary"
                  variant="custom"
                  onClick={() => {
                     handleSubmit()
                   }}
                  disabled={isLoading}
               >Submit</Button>
            </div>
         }
         {status === "completed" &&
           <div className="flex flex-row items-center gap-10">
              <div className="flex flex-col justify-center items-center">
                 <p className="text-sm font-bold">Locked tokens:</p>   
                 <p className="text-base font-black">{volume}</p>
              </div>
             
              <div className="flex flex-col justify-center items-center">
                 <p className="text-sm font-bold">Available tokens:</p>   
                 <p className="text-base font-black">{}</p>
              </div>
          </div>}
          {status === "waiting" || status === "completed" &&
            <div className="flex flex-row gap-4">              
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

// Libraries
import React, { useEffect } from 'react';
import { Button, Progress } from "@chakra-ui/react";

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
import { ProgressBar } from 'react-toastify/dist/components';

const LinkingScreen: React.FC<{room: Room}> = ({room}) => {
   /* ================================== state ================================== */
   const [status, setStatus] = React.useState("none") // none || linking || waiting || completed
   const [publicKey, setPublicKey] = React.useState("")
   const [secretKey, setSecretKey] = React.useState("")
   const [apiPass, setApiPass] = React.useState("")
   const [isLoading, setLoading] = React.useState(false)
   const [volume, setVolume] = React.useState(0)

   /* ================================== hooks ================================== */
   const router = useRouter();
   const linkExchangeMutation = useLinkExchangeMutations();
   const userFarmingQuery = useUserFarmingQuery();

   /* ================================== useEffect ================================== */
   useEffect(() => {
      if (!room) {return}

      const exchangeKey = (room.exchange_id).toLowerCase()

      console.log(userFarmingQuery.data)
      console.log(room)
      if (userFarmingQuery.data){
         console.log("farming data", userFarmingQuery.data)

         const linkStatus = userFarmingQuery.data.volume[`${exchangeKey}_status`]
         const linkVolume = userFarmingQuery.data.volume[exchangeKey]

         console.log({linkStatus})
         console.log({linkVolume})

         if (Number(linkVolume) > 0){
            if (room.name == "binance") {
               setVolume(
                  // Combine Binance futures and spot
                  Number(
                     Number(userFarmingQuery.data.volume["binanace"]) +
                     Number(userFarmingQuery.data.volume["binancecoinm"])
                  )
               )
            } else {
               setVolume(Number(Number(linkVolume).toFixed(2)))
            }
            
            setStatus("completed")
         } else if (linkStatus === "processing"){ // TODO: Switch this to whatever the state is meant to be
            setStatus("waiting")
         } else {
            setStatus("none")
         }
         
      }

   },[userFarmingQuery.data])
   /* ================================== functions ================================== */
   async function handleSubmit() {
      setLoading(true);
      linkExchangeMutation.mutate({
         exchange: room.exchange_id.toLowerCase(),
         api_key: publicKey,
         secret_key: secretKey,
         api_pass: room.needsApiPass ? apiPass : '',
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
     <div className="px-8 sm:px-0 flex flex-col justify-center items-center bg-primary-light gap-10 text-black" 
         style={{height: 'calc(100vh - 256px)', borderRadius: '20px', border: "1px solid #ff9b69", margin:"0 20px 20px 20px"}}>
         {/* Icon (Link || completion || waiting(add spinner)) */}
         {(status === "none" || status === "linking") && <LinkIcon />}
         {(status === "processing") && <Progress />}
         {(status === "completed") && <CompleteIcon />}

         {/* Title (link) */}
         <h1 className="tg-title-h1 text-black text-5xl font-black">
            {status === "none" ? `Link to ${room ? room.exchange_id : ""}` : ""}
            {status === "linking" ? "Setup link" : ""}
            {status === "waiting" ? "Processing your trading volume..." : ""}
            {status === "completed" ? "Linked" : ""}
            
         </h1>
         {/* description (link your api keys || Your api keys may take some time) */}
         <h2 className="text-sm font-medium text-black text-center max-w-sm">
            {status === "none" && "Link your trading account"}
            {status === "waiting" &&  "Your trading data may take some time to update, Check back in ~1hr."}
            {status === "waiting" &&  " We have recorded the time of your submission."}
            {status === "completed" && "Your volumes are linked to your voting account"}
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
          {status === "linking" && room.name != "Dex Sauna" &&
            <>
               <div className="relative max-w-xs w-full ">
                  <p className="absolute top-0 text-xs text-black">API PUBLIC KEY</p>
                  <div className="mt-5 relative">
                     <input
                        type="text"
                        className="border bg-primary border-slate-700 text-black rounded-sm py-2 pr-16 pl-4 w-full"
                        // placeholder="dlfa8d#kfs.."
                        value={publicKey}
                        onChange={(e) => setPublicKey(e.target.value)}
                     />
                  </div>
               </div>
               <div className="relative max-w-xs w-full mt-[-15px]">
                  <p className="absolute top-0 text-xs text-black">API SECRET KEY</p>
                  <div className="mt-5 relative">
                     <input
                        type="text"
                        className="border bg-primary border-slate-700 text-black rounded-sm py-2 pr-16 pl-4 w-full"
                        // placeholder="API Secret"
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        />
                  </div>
               </div>

               {/* need api pass */}

               {  room.needsApiPass ?
                  <div className="relative max-w-xs w-full mt-[-15px]">
                     <p className="absolute top-0 text-xs text-black">API PASS</p>
                     <div className="mt-5 relative">
                        <input
                           type="text"
                           className="border bg-surface border-slate-700 text-black rounded-sm py-2 pr-16 pl-4 w-full"
                           placeholder="API Pass"
                           value={apiPass}
                           onChange={(e) => setApiPass(e.target.value)}
                           />
                     </div>
                  </div> : ''
               }

            </>
         }
        {(status === "linking") &&
            <div className="flex flex-row gap-4">

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
                 <p className="text-sm font-bold">Calculated volume</p>   
                 <p className="text-lg font-black">{volume > 0 ? `$${volume.toLocaleString()}` : ''}</p>
              </div>
             
              {/* <div className="flex flex-col justify-center items-center">
                 <p className="text-sm font-bold">Available tokens:</p>   
                 <p className="text-base font-black">{}</p>
              </div> */}
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

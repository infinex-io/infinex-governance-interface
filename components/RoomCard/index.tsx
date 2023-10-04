import React from 'react';
// import { useTranslation } from 'react-i18next';
// Interface 
interface RoomCard {
   key: number;
	name?: string;
	description?: string;
   emoji: string;
   token: string;
   exchange_id: string;
}

export default function RoomCard({
   key,
	name,
	description,
   emoji,
   exchange_id,
   token
}: RoomCard) {

   /* ======================== Hooks ======================== */
   // const { t } = useTranslation();   w-52 h-72

	return ( 
		<div key={key} className="flex flex-col justify-between items-center p-3 gap-3 border-[1px] rounded border-solid border-[#edac8b] border-opacity-40 w-40 h-48">
         <div className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0" style={{ boxShadow: '2px 2px 8px 0px rgba(207, 116, 70, 0.38) inset' }}>
               {emoji}
         </div>
         <div className="flex flex-col items-center text-center">
            <h5 className="tg-title-h5 capitalize text-base font-bold">
               {name}
            </h5>
            <span className=" w-full text-center text-xs font-normal">
               {description}
            </span>
         </div>
         <div className="flex justify-center items-center w-full px-4 py-2 rounded-sm bg-primary farming-button-background font-normal text-xs">
            Select 
         </div>
		</div>
	);
}
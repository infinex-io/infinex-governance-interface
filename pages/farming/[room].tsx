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
import BackButton from 'components/BackButton';
import BackOnePageButton from 'components/BackOnePageButton';

// Interfaces
export interface Room {
	name: string;
	description: string;
	emoji: string;
	token: string; // BNB || ETH
	exchange_id: string; // binance || ftx
	type: string; // dex || sex
	needsApiPass: boolean; // dex || sex
	dex: boolean; // dex || sex
	guide?: string;
}

export default function Room() {
	/* ================================== state ================================== */

	/* ================================== hooks ================================== */
	const router = useRouter();
	const userFarmingQuery = useUserFarmingQuery();

	/* ================================== functions ================================== */
	const room = rooms.find((r) => r.name === router.query.room)!;

	return (
		<>
			<Head>
				<title>Infinex | Governance V3</title>
			</Head>
			<div className="flex flex-col grow bg-primary-light">
				{room && (
					<div className="animation-appear flex flex-col justify-center items-center bg-primary-light w-full p-10">
						<h1 className="text-black text-5xl font-black text-center mb-2">
							{room.emoji} {room.name}
						</h1>
						<div className="text-black text-base font-bold">Prove usage, earn voting power</div>
						<div className="text-black text-base font-bold"></div>
					</div>
				)}

				<div className="flex flex-col grow sm:flex-row justify-center items-stretch">
					{room?.locking && (
						<div className="w-full sm:w-1/2 flex flex-col">
							<LockingScreen room={room} />
							{/* {router.query.room === 'FTX Panic Room' ? (
							<FTXFileUpload />
						) : (
							<LockingScreen room={room} />
						)} */}
						</div>
					)}

					{room?.linking && (
						<div className="w-full sm:w-1/2 flex flex-col">
							<LinkingScreen room={room} />
						</div>
					)}
				</div>
				<BackOnePageButton></BackOnePageButton>
			</div>
		</>
	);
}

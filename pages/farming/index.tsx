// Components (External)
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// Components (Internal)
import rooms from '../../utils/config/rooms';
import RoomCard from 'components/RoomCard';
import infinexLogoSVG from '../../public/logos/infinex-logo.svg';

// Hooks (Internal)
import { useConnectorContext } from 'containers/Connector';
import { Button } from 'components/button';
import classNames from 'classnames';
import styles from 'styles/yams.module.css';
import { useRouter } from 'next/router';
import useUserFarmingQuery from 'queries/farming/useUserFarmingQuery';
import { useSearchParams } from 'next/navigation'

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { supabase } from 'utils/supabaseClient';
import { AuthSession } from '@supabase/supabase-js';
import { useModalFarmingContext } from 'containers/EmailModalContext';
import short from 'short-uuid';

const Farming: NextPage = () => {
	const [session, setSession] = useState<AuthSession | null>(null);
	const { setModalFarmingIsHidden, setLoggedIn } = useModalFarmingContext();
	const { connectWallet, isWalletConnected } = useConnectorContext();
	const { push } = useRouter();
	const searchParams = useSearchParams()
	// calling this here so that the user has their data pre-loaded when they open their farming page.
	const { isLoading } = useUserFarmingQuery();
	const translator = short();
	const referrer = searchParams.get('ref')
	const email = searchParams.get('email')

	useEffect(() => {
		// get ref
		console.log(referrer, "referrer")
		if (referrer !== null) {
			localStorage.setItem('inf-ref', JSON.stringify(referrer))
		}
		// if email exists in search params (from marketing email, already exists in supabase)
		console.log(email, "email")
		if (email !== null) {
			localStorage.setItem('inf-email', JSON.stringify(email))
			return;
		}
		// if email exists in local storage
		if (localStorage.getItem('inf-email') !== null) return;

		supabase.auth.getSession().then(({ data: { session } }) => {
		 	setSession(session);
			if (session !== null) {
				localStorage.setItem('inf-email', JSON.stringify(session.user.email))
				setLoggedIn(`http://gov.infinex.io/farming?ref=${translator.fromUUID(session.user.id)}`);
			}
		});
		// check if modal has been prompted before
		if (localStorage.getItem('inf-prompted') === null) {
			localStorage.setItem('inf-prompted', JSON.stringify(true))
		}
		else return;
		// if there is no supabase session, there is no email in local storage, and email does not exist in search params.
		setModalFarmingIsHidden(false);
	}, [referrer, email])

	return (
		<main className="bg-primary-light px-3 py-6 min-h-[90vh] farming-background bg-repeat-y bg-center text-black flex-grow">
			<Head>
				<title>Infinex | Governance Farming</title>
			</Head>
			<div className="flex flex-col justify-center items-center w-full max-w-xs mx-auto">
				<Image src={infinexLogoSVG} alt="Infinex Logo" height={53} className="mx-auto" />
				<h1 className="text-5xl font-bold text-center mt-[-25px]">👨🏻‍⚖️</h1>
				<h1 className="text-center text-xl font-bold text-black">Select a room in the mansion</h1>
				<p className="text-center text-sm font-normal">
					You can earn Infinex governance points by locking your tokens or proving your trade
					history.
				</p>
				<Button
					className={classNames(
						'w-64 h-12 rounded-3xl whitespace-nowrap text-sm bg-transparent hover:bg-transparent my-5',
						styles.buttonIndent
					)}
					onClick={() => {
						push('/farming/profile/');
					}}
					label="💰 View positions"
				/>
			</div>
			<div className="flex justify-center items-center">
				<div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 max-w-3xl mt-4 place-items-center gap-5">
					{rooms?.map((room: any) => (
						<>
							{isWalletConnected ? (
								<Link href={`/farming/${room.name}`} key={room.key}>
									<RoomCard
										name={room.name}
										description={room.description}
										emoji={room.emoji}
										exchange_id={room.exhange_id}
										token={room.token}
									/>
								</Link>
							) : (
								<div onClick={connectWallet} className="cursor-pointer" key={room.key}>
									<RoomCard
										name={room.name}
										description={room.description}
										emoji={room.emoji}
										exchange_id={room.exhange_id}
										token={room.token}
									/>
								</div>
							)}
						</>
					))}
				</div>
			</div>
		</main>
	);
};

export default Farming;

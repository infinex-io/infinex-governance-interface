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

const Farming: NextPage = () => {
	const { connectWallet, isWalletConnected } = useConnectorContext();
	const { push } = useRouter();

	// calling this here so that the user has their data pre-loaded when they open their farming page.
	useUserFarmingQuery();

	return (
		<main className="bg-primary-light px-3 py-6 min-h-[90vh] farming-background bg-repeat-y bg-center text-black flex-grow">
			<div className="flex flex-col justify-center items-center w-full max-w-xs mx-auto">
				<Image src={infinexLogoSVG} alt="Infinex Logo" height={53} className="mx-auto" />
				<h1 className="text-5xl font-bold text-center mt-[-25px]">👨🏻‍⚖️</h1>
				<h1 className="text-center text-xl font-bold text-black">Select a room in the mansion</h1>
				<p className="text-center text-sm font-normal">
					Earn Infinex voting power by depositing your tokens and proving your trade history
				</p>
				<Button
					className={classNames(
						'w-64 h-12 rounded-3xl whitespace-nowrap mr-4 text-sm bg-transparent hover:bg-transparent my-5',
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
										key={room.key}
										name={room.name}
										description={room.description}
										emoji={room.emoji}
										exchange_id={room.exhange_id}
										token={room.token}
									/>
								</Link>
							) : (
								<div onClick={connectWallet} className="cursor-pointer">
									<RoomCard
										key={room.key}
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

import React, { useEffect } from 'react';
import { Button, Progress } from '@chakra-ui/react';
import styles from 'styles/yams.module.css';
import LinkIcon from 'components/Icons/LinkIcon';
import BackIcon from 'components/Icons/BackIcon';
import CompleteIcon from 'components/Icons/CompleteIcon';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import useLinkExchangeMutations from 'mutations/farming/useLinkExchangeMutations';
import useUserFarmingQuery from 'queries/farming/useUserFarmingQuery';
import { Room } from 'pages/farming/[room]';
import { extractDexExchangeEntries, stripObjOfNonVolume, sumValues } from '../../utils/points';
import classNames from 'classnames';
import rooms from 'utils/config/rooms';
import Link from 'next/link';
import { Timer } from 'components/Timer';

const LinkingScreen: React.FC<{ room: Room }> = ({ room }) => {
	/* ================================== state ================================== */
	const [status, setStatus] = React.useState('linking'); // none || linking || waiting || completed
	const [publicKey, setPublicKey] = React.useState('');
	const [secretKey, setSecretKey] = React.useState('');
	const [apiPass, setApiPass] = React.useState('');
	const [isLoading, setLoading] = React.useState(false);
	const [volume, setVolume] = React.useState(0);
	const [roomData, setRoomData] = React.useState<Room | null>(null);
	const [canRetry, setCanRetry] = React.useState(false);
	const [storedTime, setStoredTime] = React.useState<Date | null>(null);

	useEffect(() => {
		let time;
		if (room !== undefined)
			try {
				time = JSON.parse(localStorage.getItem(`last${room.name}SubmissionTime`) || '');
			} catch (error) {
				setCanRetry(true);
				console.log(error);
			}
		if (time) {
			const lastSubmissionTime = new Date(time);
			lastSubmissionTime.setHours(lastSubmissionTime.getHours() + 1);
			setStoredTime(lastSubmissionTime);
		}
	}, [room]);

	useEffect(() => {
		if (room) setRoomData(rooms.find((r) => r.name === room.name)!);
	}, [room]);

	/* ================================== hooks ================================== */
	const router = useRouter();
	const linkExchangeMutation = useLinkExchangeMutations();
	const userFarmingQuery = useUserFarmingQuery();

	/* ================================== useEffect ================================== */
	useEffect(() => {
		// check if user can retry
		if (storedTime !== null) {
			if (new Date() > storedTime) {
				setCanRetry(true);
			}
		}
	}, [storedTime, status]);

	useEffect(() => {
		if (!room) {
			return;
		}

		const exchangeKey = room.exchange_id.toLowerCase();

		if (userFarmingQuery.isLoading) {
			setStatus('loading');
		}

		if (userFarmingQuery.data) {
			console.log('farming data', userFarmingQuery.data);

			let linkStatus = userFarmingQuery.data.volume[`${exchangeKey}_status`];
			const linkVolume = userFarmingQuery.data.volume[exchangeKey];

			console.log(userFarmingQuery.data);

			// if (Number(linkVolume) > 0){
			if (room.exchange_id == 'Binance') {
				setVolume(
					Number(
						// Combine Binance futures and spot
						Number(userFarmingQuery.data.volume['binance']) +
							Number(userFarmingQuery.data.volume['binancecoinm'])
					)
				);
			} else if (room.exchange_id == 'GMX') {
				setVolume(
					Number(
						// Combine Binance futures and spot
						Number(userFarmingQuery.data.volume['gmx_arbitrum']) +
							Number(userFarmingQuery.data.volume['gmx_avalanche'])
					)
				);
				linkStatus = userFarmingQuery.data.volume[`gmx_status`];
			} else if (room.exchange_id == 'SNX') {
				setVolume(Number(userFarmingQuery.data.volume['synthetix_optimism']));
				linkStatus = userFarmingQuery.data.volume[`dex_status`];
			} else if (room.exchange_id == 'Dydx') {
				setVolume(Number(userFarmingQuery.data.volume['dydx_ethereum']));
				linkStatus = userFarmingQuery.data.volume[`dex_status`];
			} else if (room.exchange_id == 'Spot Dex') {
				const dexVolumes: Record<string, any> = stripObjOfNonVolume(
					extractDexExchangeEntries(userFarmingQuery.data.volume)
				);
				const total = sumValues(dexVolumes);
				console.log(total);
				setVolume(Number(total));
				linkStatus = userFarmingQuery.data.volume[`dex_status`];
			} else if (room.exchange_id == 'GMX') {
				linkStatus = userFarmingQuery.data.volume[`dex_status`];
			} else {
				setVolume(Number(Number(linkVolume).toFixed(2)));
			}

			if (linkVolume >= 0) {
				setStatus('completed');
			} else if (linkStatus === 'processing' || linkStatus === 'queued') {
				setStatus('waiting');
			} else if (linkStatus === 'success') {
				setStatus('completed');
			} else if (linkStatus === 'failed') {
				setStatus('failed');
			} else {
				setStatus('linking');
			}
		}
	}, [userFarmingQuery.data, userFarmingQuery.isLoading]);
	/* ================================== functions ================================== */
	async function handleSubmit() {
		setLoading(true);
		if (!room.dex && publicKey.length === 0) {
			toast.error('Please enter a public key.');
			setLoading(false);
			return;
		} else if (!room.dex && secretKey.length === 0) {
			toast.error('Please enter a secret key.');
			setLoading(false);
			return;
		}

		linkExchangeMutation.mutate(
			{
				exchange: room.exchange_id.toLowerCase(),
				api_key: publicKey,
				secret_key: secretKey,
				api_pass: room.needsApiPass ? apiPass : '',
				type: room.type,
			},
			{
				onSettled: (data, error: any, variables, context) => {
					if (error) {
						setStatus('linking');
						setLoading(false);
						if (error?.message) {
							toast.error(JSON.stringify(error.message).replaceAll('"', ''));
						} else {
							toast.error(JSON.stringify(error));
						}
					} else if (!data.message.success) {
						setStatus('linking');
						setLoading(false);
						if (data?.message.message) {
							toast.error(JSON.stringify(data.message.message).replaceAll('"', ''));
						}
					} else {
						setStatus('waiting');
						setLoading(false);
						userFarmingQuery.refetch();
						localStorage.setItem(
							`last${room.name}SubmissionTime`,
							JSON.stringify(new Date().getTime())
						);
					}
				},
			}
		);
	}

	interface idMapTypes {
		[key: string]: string;
	}
	const idMap : idMapTypes = {
		'Spot Dex': 'AMMs',
		SNX: 'Synthetix',
	};

	const idToRead = idMap[room.exchange_id] ? idMap[room.exchange_id] : room.exchange_id;

	const linkingDescription = room.dex ? (
		<p>Connect your wallet to prove your onchain trading history.</p>
	) : (
		<p>
			Link your read-only API keys to prove your {idToRead} trading history. See{' '}
			<a
				href={room.guide}
				className="underline"
				style={{ textUnderlinePosition: 'under' }}
				target="_blank"
			>
				the guide
			</a>{' '}
			for more information.
		</p>
	);

	return (
		<div
			className={classNames(
				'2xl:pt-[30%] md:pt-[15%] pt-[10%] animation-appear animation-delay-1 p-8 flex flex-col grow relative items-center bg-primary-light gap-5 text-black',
				styles.boxIndent
			)}
			style={{
				// height: 'calc(100vh - 200px)',
				borderRadius: '20px',
				margin: '0 20px 20px 20px',
			}}
		>
			{/* {roomData && roomData.guide && (
				<Link
					className={classNames(
						`flex items-center justify-center h-14 px-4 gap-3 absolute top-0 right-0 mt-4 mr-4
            rounded-2xl flex-shrink-0 text-2xl`,
						styles.boxIndent
					)}
					href={roomData.guide || ''}
					target="blank"
				>
					📔
				</Link>
			)} */}
			{/* Icon (Link || completion || waiting(add spinner)) */}
			{(status === 'none' || status === 'linking') && <LinkIcon />}
			{status === 'processing' && <Progress />}
			{status === 'completed' && <CompleteIcon />}

			{/* Title (link) */}
			<h1 className="tg-title-h1 text-black text-5xl font-black">
				{status === 'none' || status === 'linking' ? `Link to ${room ? idToRead : ''}` : ''}
				{status === 'loading' ? '' : ''}
				{status === 'waiting' ? 'Processing your volume' : ''}
				{status === 'completed' ? 'Linked' : ''}
				{status === 'failed'
					? `There was an error` // It's taking longer than usual to connect to ${room.exchange_id}, we're investigating. Your submission time was recorded.
					: ''}
			</h1>

			{status === 'loading' && (
				<p className="text-black text-sm font-medium">Preparing the room...</p>
			)}

			{/* description (link your api keys || Your api keys may take some time) */}
			<h2 className="text-sm font-medium text-black text-center max-w-sm">
				{(status === 'none' || status === 'linking') && <p>{linkingDescription}</p>}

				{(status === 'none' || status === 'linking') && room?.info && (
					<p className="mt-1">{room.info}</p>
				)}

				{status === 'waiting' && "We're crunching the numbers - check back later."}
				{status === 'failed' && !canRetry && (
					<div className="flex flex-col">
						<div className="mb-1">
							This may have occurred due to invalid keys, submitting the same keys via another
							account, or recent submissions from another account.
						</div>
						<div className="flex flex-col justify-center items-center">
							In order to prevent spam, you can retry in:
							<Timer expiryTimestamp={storedTime?.getTime() || 0} className="font-bold mt-3" />
						</div>
					</div>
				)}
				{status === 'failed' && canRetry && (
					<Button
						height="42px"
						isLoading={isLoading}
						loadingText="Submitting"
						className={classNames('bg-primary', styles.primaryButtonShadow)}
						background="primary"
						variant="custom"
						onClick={() => {
							setStatus('none');
						}}
						disabled={isLoading || publicKey.length === 0 || secretKey.length === 0}
					>
						Try again
					</Button>
				)}
				{/* {status === 'waiting' && ' We have recorded the time of your submission.'} */}
				{status === 'completed' &&
					`Your ${
						room.dex ? 'decentralised ' : ''
					}trading volume has been calculated and attached to your address.`}
			</h2>
			{/* Link button (hide when linking) */}
			{status === 'none' && (
				<button
					className={classNames(
						'text-black bg-primary rounded-3xl py-2 px-4',
						styles.primaryButtonShadow
					)}
					onClick={() => setStatus('linking')}
				>
					Link
				</button>
			)}
			{(status === 'waiting' || (status === 'failed' && !canRetry)) && (
				<button
					className={classNames(
						'text-black bg-primary rounded-3xl py-2 px-4',
						styles.primaryButtonShadow
					)}
					onClick={() => {
						router.push('/farming');
					}}
				>
					Done
				</button>
			)}
			{status === 'linking' && !room.dex && (
				<div className="gap-8 flex flex-col">
					<div className="relative max-w-xs w-full ">
						<p className="absolute top-0 text-xs text-black">API PUBLIC KEY</p>
						<div className="mt-5 relative">
							<input
								type="text"
								className={classNames(
									'text-black bg-transparent rounded-3xl py-2 px-4 w-full focus:outline-none text-sm',
									styles.inputIndent
								)}
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
								className={classNames(
									'text-black bg-transparent rounded-3xl py-2 px-4 w-full focus:outline-none text-sm',
									styles.inputIndent
								)}
								value={secretKey}
								onChange={(e) => setSecretKey(e.target.value)}
							/>
						</div>
					</div>

					{/* need api pass */}
					{room.needsApiPass ? (
						<div className="relative max-w-xs w-full mt-[-15px]">
							<p className="absolute top-0 text-xs text-black">API PASS</p>
							<div className="mt-5 relative">
								<input
									type="text"
									className={classNames(
										`bg-primary-light text-black rounded-3xl py-2 px-4 w-full focus:outline-none`,
										styles.inputIndent
									)}
									value={apiPass}
									onChange={(e) => setApiPass(e.target.value)}
								/>
							</div>
						</div>
					) : (
						''
					)}
				</div>
			)}
			{status === 'linking' && (
				<div className="flex flex-row gap-4">
					{/* Submit Button */}
					<Button
						height="42px"
						isLoading={isLoading}
						loadingText="Submitting"
						className={classNames('bg-primary mb-4', styles.primaryButtonShadow)}
						background="primary"
						variant="custom"
						onClick={() => {
							handleSubmit();
						}}
						disabled={isLoading || publicKey.length === 0 || secretKey.length === 0}
					>
						Submit
					</Button>
				</div>
			)}
			{status === 'completed' && (
				<div className="flex flex-row items-center gap-10">
					<div className="flex flex-col justify-center items-center">
						<p className="text-sm font-bold">Calculated volume</p>
						<p className="text-lg font-black">
							{volume > 0 ? `$${volume.toLocaleString()}` : '$0'}
						</p>
					</div>
				</div>
			)}
			{status === 'waiting' ||
				(status === 'completed' && (
					<div className="flex flex-row gap-4">
						{/* Button */}
						<button
							className={classNames(
								'text-black bg-primary rounded-3xl py-2 px-4',
								styles.primaryButtonShadow
							)}
							onClick={() => {
								router.push('/farming');
							}}
						>
							Done
						</button>
					</div>
				))}
		</div>
	);
};

export default LinkingScreen;

// Libraries
import React from 'react';

// Components (Internal)
import LockIcon from 'components/Icons/LockIcon';
import CompleteIcon from 'components/Icons/CompleteIcon';
import BackIcon from 'components/Icons/BackIcon';
import styles from 'styles/yams.module.css';

// Components (External)
import { Button } from '@chakra-ui/react';

// Hooks (Exteneral)
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

// Hooks (Internal)
import useUserFarmingQuery from 'queries/farming/useUserFarmingQuery';
import { useConnectorContext } from 'containers/Connector/Connector';
import useStakeTokenMutation from 'mutations/farming/useStakeTokenMutation';

// Interfaces
import { Room } from 'pages/farming/[room]';
import classNames from 'classnames';
import rooms from 'utils/config/rooms';

const LockingScreen: React.FC<{ room: Room }> = ({ room }) => {
	const roomData = rooms.find((r) => r.name === room.name)!;
	/* ================================== state ================================== */
	const [status, setStatus] = React.useState('none'); // "none" || "locking" || "completed"
	const [inputValue, setInputValue] = React.useState('');

	/* ================================== hooks ================================== */
	const router = useRouter();
	const { walletAddress } = useConnectorContext();
	const userFarmingQuery = useUserFarmingQuery();
	const stakeTokenMutation = useStakeTokenMutation();
	const [loading, setLoading] = React.useState(false);
	const [amountLocked, setAmountLocked] = React.useState(0);

	/* ================================== Effects ================================== */
	useEffect(() => {
		if (walletAddress) {
			userFarmingQuery.refetch();
		}
	}, [walletAddress]);

	useEffect(() => {
		const amount = userFarmingQuery.data?.staking[`${room.token}_amount_locked`] as number;
		setAmountLocked(amount);
		amount > 0 ? setStatus('locked') : '';

		// setLoading(false)
	}, [userFarmingQuery]);

	function handleStake() {
		if (Number(inputValue) <= 0) {
			toast.error('Input must be greater than 0.');
			return;
		} else if (userFarmingQuery.data?.staking[`${room.token}_available`] !== undefined) {
			if (Number(inputValue) > userFarmingQuery.data?.staking[`${room.token}_available`]) {
				toast.error('Input exceeds available tokens.');
				return;
			}
		}
		setLoading(true);
		const overide = amountLocked !== undefined && amountLocked > 0;
		stakeTokenMutation.mutate(
			{
				token: room.token.toLowerCase(),
				amount: Number(inputValue),
				overide: overide,
			},
			{
				onSettled: (data, error: any, variables, context) => {
					if (error) {
						setLoading(false);
						if (error?.message) {
							toast.error(JSON.stringify(error.message));
						} else {
							toast.error(JSON.stringify(error));
						}
					} else {
						setStatus('completed');
						setLoading(false);
						userFarmingQuery.refetch();
					}
				},
			}
		);
	}

	console.log('lock status:', status);

	return (
		<div
			className={classNames(
				'animation-appear animation-delay-1 p-8 grow flex flex-col justify-center items-center bg-primary-light gap-5 text-black',
				styles.boxIndent
			)}
			style={{
				// height: 'calc(100vh - 200px)',
				borderRadius: '20px',
				margin: '0 20px 20px 20px',
			}}
		>
			{/* Icon */}
			{status === 'completed' ? (
				<LockIcon width={26} height={35} />
			) : (
				<CompleteIcon width={33} height={33} />
			)}

			{/* Title [Lock, Locked] */}
			<h1 className="tg-title-h1 text-5xl font-black text-black">
				{status === 'completed' || status === 'locked'
					? `Locked ${room ? room.token : ''}`
					: `Lock ${room ? room.token : ''}`}
			</h1>

			{amountLocked > 0 && (
				<div className="animation-appear flex flex-col justify-center items-center">
					<p className="text-sm font-bold">Locked tokens:</p>
					<p className="text-base font-black">{room ? amountLocked : ''}</p>
				</div>
			)}

			{/* description */}
			<p className="animation-appear text-sm font-medium text-center max-w-sm">
				{status === 'completed' ? (
					<span className="animation-appear">You've successfully locked your tokens.</span>
				) : (
					<span className="animation-appear">
						If you move these tokens during the governance farming period, your voting power will
						stop compounding.
					</span>
				)}
				{roomData.extra_details && status !== 'completed' && status !== 'locked' && (
					<div className="mt-2">{roomData.extra_details}</div>
				)}
			</p>

			{status != 'none' && (
				<div className="flex flex-row items-center gap-10">
					{amountLocked == 0 && (
						<div className="flex flex-col justify-center items-center">
							<p className="text-sm font-bold">Locked tokens:</p>
							<p className="text-base font-black">{room ? amountLocked : ''}</p>
						</div>
					)}

					{status != 'completed' && status != 'locked' && (
						<div className="flex flex-col justify-center items-center">
							<p className="text-sm font-bold">Available tokens:</p>
							<p className="text-base font-black">
								{userFarmingQuery.data?.staking[`${room.token}_available`]
									? userFarmingQuery.data?.staking[`${room.token}_available`]
									: 0}
							</p>
						</div>
					)}
				</div>
			)}

			{/* Lock (block, hidden - lockingState) */}
			{status === 'none' && (amountLocked == 0 || !amountLocked) && (
				<button
					className={classNames(styles.primaryButtonShadow, 'bg-primary')}
					onClick={() => setStatus('locking')}
				>
					Lock
				</button>
			)}

			{/* Todo add override stake */}
			{status === 'none' && amountLocked == 0 && (
				<button
					className="text-white bg-black rounded-3xl py-2 px-4"
					onClick={() => setStatus('locking')}
				>
					Update lock
				</button>
			)}

			{status === 'locking' && (
				<div className="relative max-w-xs w-full ">
					<p className="absolute top-0 text-xs font-black">AMOUNT</p>
					<div className="mt-5 relative">
						<input
							type="number"
							className={classNames(
								'border bg-transparent rounded-3xl placeholder:text-[#0000003b] focus:outline-none text-black py-2 px-4 w-full',
								styles.inputIndent
							)}
							placeholder="Enter amount"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							disabled={loading}
						/>
						<button
							className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-black rounded-3xl py-1 px-2"
							onClick={() =>
								setInputValue(
									userFarmingQuery.data?.staking[`${room.token}_available`].toString() ?? '0'
								)
							}
						>
							Max
						</button>
					</div>
				</div>
			)}

			{/* (hidden, unhidden - lockingState) */}
			{status === 'locking' && (
				<div className="flex flex-row gap-4 mt-5">
					{/* Backicon + Text */}
					<button
						className={classNames(styles.primaryButtonShadow, 'flex items-center gap-2')}
						disabled={loading}
						onClick={() => {
							setStatus('none');
						}}
					>
						<BackIcon width={10} height={10} />
						<span>Back</span>
					</button>
					{/* Button */}
					<Button
						variant="custom"
						className={classNames(styles.primaryButtonShadow, 'bg-primary')}
						onClick={() => {
							handleStake();
						}}
						disabled={loading}
						isLoading={loading}
					>
						Lock tokens
					</Button>
				</div>
			)}
			{status === 'completed' && (
				<div className="flex flex-row gap-4">
					{/* Backicon + Text */}
					{/* <button 
                  className="text-black bg-none rounded-sm py-2 px-4 border border-black flex items-center gap-2"
                  onClick={() => {
                     setStatus("locking")
                  }
                  }
               >
                  Lock more
               </button> */}
					{/* Button */}
					<button
						className={classNames('bg-primary rounded-3xl py-2 px-4', styles.primaryButtonShadow)}
						onClick={() => {
							router.push('/farming');
						}}
					>
						Done
					</button>
				</div>
			)}
		</div>
	);
};

export default LockingScreen;

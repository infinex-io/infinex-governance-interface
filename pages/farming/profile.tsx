import Main from 'components/Main';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProfileSection from 'components/Profile';
import { isWalletAddress } from 'utils/validate';
import { t } from 'i18next';
import { Loader } from 'components/Loader/Loader';
import rooms from 'utils/config/rooms';
import { Button } from 'components/button';
import ProfileIcon from 'components/Icons/ProfileIcon';
import useUserFarmingQuery from 'queries/farming/useUserFarmingQuery';
import { useEffect, useState } from 'react';
import { formatNumberWithLocale, formatPercent } from '../../utils/numbers';
import { extractDexExchangeEntries } from '../../utils/points';
import classNames from 'classnames';
import styles from "styles/yams.module.css"
import PiggBankIcon from 'components/Icons/PiggyBankIcon';
import LinkIcon from 'components/Icons/LinkIcon';

export default function Profile() {
	// const router = useRouter();
	const address = "0x123-todo"

	// const exchangeIdsLowercased = rooms.map(room => room.exchange_id.toLowerCase());

	const [userTotals, setUserTotals] = useState<any>({})
	const [platformTotals, setPlatformTotals] = useState<any>({})

	const userFarmingQuery = useUserFarmingQuery();
	useEffect(() => {
		console.log(userFarmingQuery.data)

		const userTotals = userFarmingQuery?.data?.points[`points`]
		const platformTotals = userFarmingQuery?.data?.points[`pointsPlatform`]

		console.log(userTotals ? extractDexExchangeEntries(userTotals) : "")

		setUserTotals(userTotals);
		setPlatformTotals(platformTotals);
	}, [userFarmingQuery])


	// todo move to component
	return (
		<>
			<Head>
				<title>Infinex | {address ? address : 'Profile'}</title>
			</Head>

			{!userTotals?.total_points || userTotals?.total_points == 0 ?
				<Main>
					<div style={{ height: '100vh' }} className="px-8 sm:px-0 flex flex-col justify-center items-center gap-6 bg-primary-light text-black">
						<h1 className="text-black text-4xl font-black text-center m-2">{!platformTotals?.total_points ? "Loading..." : "Start farming to earn points"}</h1>
					</div>
				</Main> :
				<Main>
					<div className="px-8 py-8 flex flex-col justify-center items-center bg-primary-light gap-6 text-black">

						{/* Icon */}
						{/* <span style={{color:"black"}}><ProfileIcon></ProfileIcon></span> */}

						{/* Your Stats heading */}
						<h1 className="text-black text-4xl font-black text-center my-2">Your Stats</h1>

						<p className="text-black text-2xl font-bold mt-7">Governance power</p>

						{/* Table */}
						<div className={classNames("hidden rounded-3xl sm:table text-center container py-3", styles.boxIndent)}>
							<div className="table-row">
								{[
									'Governance power',
									'% of governance power',
									'Users farming',
									'Pool ends'
								].map((heading, index) => (
									<div key={index} className="table-cell px-4 py-2 font-semibold">{heading}</div>
								))}
							</div>
							<div className="table-row">
								{[
									formatNumberWithLocale(userTotals?.total_points),
									// formatNumberWithLocale(userTotals?.total_points_raw),
									formatPercent(platformTotals?.total_points / userTotals?.total_points),
									platformTotals?.total_user_count,
									'TODO ADD TIME (12 hours)'
								].map((data, index) => (
									<div key={index} className="table-cell px-4 py-2">{data}</div>
								))}
							</div>
						</div>

						{/* Collapsible table for mobile */}
						<div className="sm:hidden flex flex-col">
							{['Heading1', 'Heading2', 'Heading3', 'Heading4', 'Heading5'].map((heading, index) => (
								<div key={index} className="px-4 py-2 border-b border-white">
									{heading}: {'Data' + (index + 1)}
								</div>
							))}
						</div>

						{/* Your Pools heading */}
						<h1 className="text-black text-2xl font-bold text-center mt-20">Your Pools</h1>

						{/* Pool Boxes */}
						<div className="grid md:grid-cols-2 grid-cols-1 gap-4 w-full container">
							{userTotals ? (Object.values(rooms)).map((room, index) => {
								const roomData = rooms.find(r => r.name === room.name)!;
								return (
									userTotals[`${room.exchange_id.toLowerCase()}`] > 0 ?
										<div key={index} className={classNames("p-4 rounded-3xl", styles.boxIndent)}>
											<div className="flex flex-col items-center p-4 rounded" style={{ background: 'rgba(0,0,0,0)' }}>

												{/* Box Heading */}
												<div className={classNames("flex items-center justify-center w-14 h-14 rounded-full flex-shrink-0 text-3xl", styles.boxIndent)}>
													{roomData.emoji}
												</div>
												<h2 className="text-xl font-bold mt-3">{room.name}</h2>

												{/* Buttons */}
												<div className="flex gap-3">
													<span className="text-xs bg-[#F59260] rounded-3xl p-2 px-3 flex items-center justify-center gap-2">
														<PiggBankIcon width={16} />
														Staked
													</span>
													<span className="text-xs bg-[#F59260] rounded-3xl p-2 px-3 flex items-center justify-center gap-2">
														<LinkIcon width={17} />
														Linked
													</span>
												</div>

												{/* Data Points */}
												<div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mt-4 text-center w-full">
													<div>
														<h3 className="text-sm font-semibold">{`Your points`}</h3>
														<p>{formatNumberWithLocale(userTotals[`${room.exchange_id.toLowerCase()}`])}</p>
													</div>
													<div>
														<h3 className="text-sm font-semibold">{`Your points (inflation)`}</h3>
														<p>{formatNumberWithLocale(userTotals[`${room.exchange_id.toLowerCase()}_raw`])}</p>
													</div>
													<div>
														<h3 className="text-sm font-semibold">{`Points in pool`}</h3>
														<p>{formatNumberWithLocale(platformTotals[`${room.exchange_id.toLowerCase()}_total_points`])}</p>
													</div>
													<div>
														<h3 className="text-sm font-semibold">{`Users in pool`}</h3>
														<p>{platformTotals[`${room.exchange_id.toLowerCase()}_user_count`]}</p>
													</div>
												</div>
											</div>
										</div> : ""
								)
							}) : "Loading..."}
						</div>
					</div>
				</Main>
			}
		</>
	);
}

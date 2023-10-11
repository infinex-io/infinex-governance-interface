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

export default function Profile() {
	// const router = useRouter();
	const address = "0x123-todo"

	const exchangeIdsLowercased = rooms.map(room => room.exchange_id.toLowerCase());

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
			<Main>
				<div style={{height: '100%'}} className="px-8 sm:px-0 flex flex-col justify-center items-center bg-primary gap-6 text-black">
	
					{/* Icon */}
					{/* <span style={{color:"black"}}><ProfileIcon></ProfileIcon></span> */}
					
					{/* Your Stats heading */}
					<h1 className="text-black text-4xl font-black text-center m-2">Your Stats</h1>

					<p className="text-black text-base font-bold">Governance power</p>

					{/* Table */}
					<div className="hidden sm:table border-b border-white">
						<div className="table-row">
						{[
							'Governance power', 
							'Governance power (inflation)', 
							'% of governance power', 
							'Users farming', 
							'Pool ends'
						].map((heading, index) => (
							<div key={index} className="table-cell px-4 py-2">{heading}</div>
						))}
						</div>
						<div className="table-row">
						{[
							formatNumberWithLocale(userTotals?.total_points), 
							formatNumberWithLocale(userTotals?.total_points_raw),
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
					<h1 className="text-black text-4xl font-black text-center">Your Pools</h1>

					{/* Pool Boxes */}
					<div className="flex flex-wrap justify-center bg-primary">
						{ userTotals ? (Object.values(rooms)).map((room, index) => (
							userTotals[`${room.exchange_id.toLowerCase()}`] > 0 ? <div key={index} style={{border: 'black solid 1px'}} className="w-full sm:w-1/2 p-4">
								<div className="flex flex-col items-center p-4 bg-gray-700 rounded"  style={{background: 'rgba(0,0,0,0)'}}>
								
								{/* Box Heading */}
								<h2 className="text-xl">{room.name}</h2>
								
								{/* Buttons */}
								<div className="flex">
									<Button className="px-4 py-2 mr-2 bg-blue-500 rounded">Staked</Button>
									<Button className="px-4 py-2 ml-2 bg-blue-500 rounded">Linked</Button>
								</div>

								{/* Data Points */}
								<div className="grid grid-cols-2 gap-4 mt-4">
									<div>
										<h3 className="text-sm">{`Your points`}</h3>
										<p>{formatNumberWithLocale(userTotals[`${room.exchange_id.toLowerCase()}`])}</p>
									</div>
									<div>
										<h3 className="text-sm">{`Your points (inflation)`}</h3>
										<p>{formatNumberWithLocale(userTotals[`${room.exchange_id.toLowerCase()}_raw`])}</p>
									</div>
									<div>
										<h3 className="text-sm">{`Points in pool`}</h3>
										<p>{formatNumberWithLocale(platformTotals[`${room.exchange_id.toLowerCase()}`])}</p>
									</div>
									<div>
										<h3 className="text-sm">{`Users in pool`}</h3>
										<p>{formatNumberWithLocale(platformTotals[`${room.exchange_id.toLowerCase()}_user_count`])}</p>
									</div>
								</div>
								</div>
							</div> : ""
						)) : "Loading..."}
					</div>
				</div>
			</Main>
		</>
	);
}

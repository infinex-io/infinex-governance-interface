import { Pagination } from '@synthetixio/ui';
import BackButton from 'components/BackButton';
import VoteBanner from 'components/Banners/VoteBanner';
import { Loader } from 'components/Loader/Loader';
import Main from 'components/Main';
import MemberCard from 'components/MemberCard/Index';
import { VoteResultBanner } from 'components/VoteResultBanner';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCurrentPeriod } from 'queries/epochs/useCurrentPeriodQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useGetCurrentVoteStateQuery } from 'queries/voting/useGetCurrentVoteStateQuery';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from 'utils/capitalize';
import { parseQuery } from 'utils/parse';
import { useConnectorContext } from 'containers/Connector';
import { compareAddress } from 'utils/helpers';
import Papa from 'papaparse'


const PAGE_SIZE = 8;

export default function VoteCouncil() {
	const { query, push } = useRouter();
	const { t } = useTranslation();
	const [activePage, setActivePage] = useState(0);
	const [sortedNominees, setSortedNominees] = useState<any>([]);
	const activeCouncil = parseQuery(query?.council?.toString());
	const { walletAddress } = useConnectorContext();
	const { data: periodData } = useCurrentPeriod(activeCouncil.module);
	const nomineesQuery = useNomineesQuery(activeCouncil.module);
	const voteStatusQuery = useGetCurrentVoteStateQuery(walletAddress || '');
	const [address, setAddress] = useState<string | undefined>();
	const [prev, setPrev] = useState<any>();

	const period = periodData?.currentPeriod;

	const startIndex = activePage * PAGE_SIZE;
	const endIndex =
		nomineesQuery.data?.length && startIndex + PAGE_SIZE > nomineesQuery.data?.length
			? nomineesQuery.data!.length
			: startIndex + PAGE_SIZE;

	useEffect(() => {
		if (period !== 'VOTING') push('/');
	}, [period, push]);

	useEffect(() => {
		setSortedNominees(nomineesQuery.data && [...nomineesQuery.data].sort((a) => (compareAddress(a, walletAddress) ? -1 : 1)));
		setPrev(nomineesQuery.data && [...nomineesQuery.data].sort((a) => (compareAddress(a, walletAddress) ? -1 : 1)))
	}, [])

	// load csvs
	useEffect(() => {
		let csvFilePath;
		if (activeCouncil.name === "trade") csvFilePath = '/nominees/trade_output.csv';
		else if (activeCouncil.name === "ecosystem") csvFilePath = '/nominees/eco_output.csv';
		else if (activeCouncil.name === "treasury") csvFilePath = '/nominees/treasury_output.csv';
		else return;

		fetch(csvFilePath)
			.then((response) => response.text())
			.then((csvData) => {
				// Parse the CSV data using PapaParse
				Papa.parse(csvData, {
					dynamicTyping: true, // Automatically parse numbers and booleans
					complete: function (results) {
						// Results.data contains the parsed data
						if (nomineesQuery.data === undefined || results.data.length === 0) return;
						const arr = results.data.map((row : any) => row[0]);
						// Filter addresses that exist in the given array
						const existingAddresses = nomineesQuery.data.filter((address) => arr.includes(address));
						// Filter addresses that don't exist in the given array
						const remainingAddresses = nomineesQuery.data.filter((address) => !arr.includes(address));
						// Concatenate the existing addresses with the remaining addresses
						setSortedNominees(existingAddresses.concat(remainingAddresses));
						setPrev(existingAddresses.concat(remainingAddresses))
					},
				});
			});
	}, [])


	useEffect(() => {
		if (address === undefined || prev === undefined) {
			setSortedNominees(prev)
			return;
		};
		// Update the state with the filtered array
		setSortedNominees(prev.filter((str : string) => str.includes(address)));
	}, [address])

	return (
		<>
			<Head>
				<title>Infinex | Governance</title>
			</Head>
			<Main>
				{activeCouncil && <VoteBanner deployedModule={activeCouncil.module} />}
				<div className="container">
					<div className="relative w-full">
						<BackButton />
						<h1 className="tg-title-h1 text-center pt-5">
							{t('vote.nominees', { council: capitalizeString(activeCouncil.name) })}
						</h1>
						<span className="tg-body text-center block text-gray-500">{t('vote.subline')}</span>
					</div>
					<div className="flex flex-wrap justify-center xs:px-3 px-0 py-3 container mx-auto">
						{nomineesQuery.isLoading || nomineesQuery.isLoading ? (
							<Loader />
						) : nomineesQuery.data?.length ? (
							<>
								<div className="xs:px-3 inline-flex mx-auto flex-col align-center justify-center w-full xs:w-auto">
									<div className="w-full xs:px-2">
										<VoteResultBanner />
									</div>
									<input placeholder='Search by wallet address' onChange={(e) => setAddress(e.target.value)}
									className={`text-xs focus:outline-0 bg-transparent border border-slate-800 placeholder:text-slate-600
									transition focus:border-primary rounded px-3 py-2 max-w-[210px] mt-4 xs:mx-2`}/>
									<div className="flex flex-col xs:flex-row flex-wrap justify-center py-2 max-w-[905px] mx-auto w-full">
										{sortedNominees?.slice(startIndex, endIndex).map((walletAddress : any, index : any) => (
											<MemberCard
												className="my-2 xs:m-2"
												key={walletAddress.concat(String(index).concat('voting'))}
												walletAddress={walletAddress}
												council={activeCouncil.name}
												deployedModule={activeCouncil.module}
												state="VOTING"
												votedFor={
													voteStatusQuery.data &&
													voteStatusQuery.data[activeCouncil.name].candidateAddress
												}
											/>
										))}
									</div>
									<div className="w-full">
										<Pagination
											className="mx-auto py-10"
											pageIndex={activePage}
											gotoPage={setActivePage}
											length={nomineesQuery.data.length}
											pageSize={PAGE_SIZE}
										/>
									</div>
								</div>
							</>
						) : (
							<h4 className="tg-title-h4 text-center mt-20">{t('vote.no-nominations')}</h4>
						)}
					</div>
				</div>
			</Main>
		</>
	);
}

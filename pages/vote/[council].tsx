import { Pagination } from '@synthetixio/ui';
import BackButton from 'components/BackButton';
import VoteBanner from 'components/Banners/VoteBanner';
import { Loader } from 'components/Loader/Loader';
import Main from 'components/Main';
import MemberCard from 'components/MemberCard/Index';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useGetCurrentVoteStateQuery } from 'queries/voting/useGetCurrentVoteStateQuery';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from 'utils/capitalize';
import { parseQuery } from 'utils/parse';
import { useAccount } from 'wagmi';

const PAGE_SIZE = 8;

export default function VoteCouncil() {
	const { query, push } = useRouter();
	const { t } = useTranslation();
	const [activePage, setActivePage] = useState(0);
	const activeCouncil = parseQuery(query?.council?.toString());
	const { data } = useAccount();
	const { data: periodData } = useCurrentPeriod(activeCouncil.module);
	const nomineesQuery = useNomineesQuery(activeCouncil.module);
	const voteStatusQuery = useGetCurrentVoteStateQuery(data?.address || '');

	const startIndex = activePage * PAGE_SIZE;
	const endIndex =
		nomineesQuery.data?.length && startIndex + PAGE_SIZE > nomineesQuery.data?.length
			? nomineesQuery.data!.length
			: startIndex + PAGE_SIZE;

	useEffect(() => {
		if (periodData?.currentPeriod !== 'VOTING') push('/');
	}, [periodData, push]);
	const sortedNominees =
		nomineesQuery.data && [...nomineesQuery.data].sort((a) => (a === data?.address ? -1 : 1));
	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
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
					<div className="flex flex-wrap justify-center p-3 container mx-auto">
						{nomineesQuery.isLoading || nomineesQuery.isLoading ? (
							<Loader />
						) : nomineesQuery.data?.length ? (
							<>
								<div className="flex flex-wrap justify-center p-3 max-w-[1000px] w-full mx-auto">
									{sortedNominees?.slice(startIndex, endIndex).map((walletAddress, index) => (
										<MemberCard
											className="m-2"
											key={walletAddress.concat(String(index).concat('voting'))}
											walletAddress={walletAddress}
											council={activeCouncil.name}
											deployedModule={activeCouncil.module}
											state="VOTING"
											votedFor={
												voteStatusQuery.data && voteStatusQuery.data[activeCouncil.name].candidate
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
							</>
						) : (
							<h4 className="tg-title-h4 text-center">{t('vote.no-nominations')}</h4>
						)}
					</div>
				</div>
			</Main>
		</>
	);
}

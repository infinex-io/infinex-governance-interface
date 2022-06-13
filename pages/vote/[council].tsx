import VoteBanner from 'components/Banners/VoteBanner';
import { Loader } from 'components/Loader/Loader';
import Main from 'components/Main';
import MemberCard from 'components/MemberCard/Index';
import {
	ArrowDropdownLeftIcon,
	ArrowDropdownRightIcon,
	SkipLeftIcon,
	SkipRightIcon,
} from 'components/old-ui';
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

const paginationStep = 8;

export default function VoteCouncil() {
	const { query, push } = useRouter();
	const { t } = useTranslation();
	const [activePage, setActivePage] = useState(0);
	const activeCouncil = parseQuery(query?.council?.toString());
	const { data } = useAccount();
	const { data: periodData } = useCurrentPeriod(activeCouncil.module);
	const nomineesQuery = useNomineesQuery(activeCouncil.module);
	const voteStatusQuery = useGetCurrentVoteStateQuery(data?.address || '');
	const maxPages = nomineesQuery.data?.length
		? Math.floor(nomineesQuery.data.length / paginationStep)
		: 0;

	const canScrollRight = nomineesQuery.data?.length
		? nomineesQuery.data.length > activePage * paginationStep + paginationStep
		: false;
	const startIndex = !activePage ? 0 : activePage * paginationStep;
	const endIndex =
		nomineesQuery.data?.length && startIndex + paginationStep > nomineesQuery.data?.length
			? nomineesQuery.data!.length
			: startIndex + paginationStep;

	useEffect(() => {
		if (periodData?.currentPeriod !== 'VOTING') push('/');
	}, [periodData, push]);

	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				{activeCouncil && <VoteBanner deployedModule={activeCouncil.module} />}
				<h1 className="tg-title-h1 text-center">
					{t('vote.nominees', { council: capitalizeString(activeCouncil.name) })}
				</h1>
				<div className="flex flex-wrap justify-center p-3 max-w-[1000px] mx-auto">
					{nomineesQuery.isLoading || nomineesQuery.isLoading ? (
						<Loader />
					) : nomineesQuery.data?.length ? (
						<>
							{nomineesQuery.data?.slice(startIndex, endIndex).map((walletAddress, index) => (
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
							<div className="w-full flex justify-around items-center gap-5 max-w-[330px] mx-auto pb-40">
								<SkipLeftIcon
									active={activePage !== 0}
									onClick={() => setActivePage(0)}
									className="cursor-pointer"
								/>
								<ArrowDropdownLeftIcon
									className="cursor-pointer"
									onClick={() => setActivePage(activePage - 1 >= 0 ? activePage - 1 : 0)}
									active={activePage !== 0}
								></ArrowDropdownLeftIcon>
								<h6 className="tg-title-h6 text-gray-500 select-none">
									{startIndex + 1}-{endIndex}
									&nbsp;
									{t('councils.of')}&nbsp;
									{nomineesQuery.data.length}
								</h6>
								<ArrowDropdownRightIcon
									className="cursor-pointer"
									active={canScrollRight}
									onClick={() => canScrollRight && setActivePage(activePage + 1)}
								></ArrowDropdownRightIcon>
								<SkipRightIcon
									active={canScrollRight}
									onClick={() =>
										setActivePage(
											canScrollRight && (nomineesQuery.data.length / paginationStep) % 2 === 0
												? activePage + maxPages - 1
												: maxPages
										)
									}
									className="cursor-pointer"
								/>
							</div>
						</>
					) : (
						<h4 className="tg-title-h4 text-center">{t('vote.no-nominations')}</h4>
					)}
				</div>
			</Main>
		</>
	);
}

import BackButton from 'components/BackButton';
import NominateSelfBanner from 'components/Banners/NominateSelfBanner';
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
import useIsNominatedForCouncilInNominationPeriod from 'queries/nomination/useIsNominatedForCouncilInNominationPeriod';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from 'utils/capitalize';
import { parseQuery } from 'utils/parse';
import { useAccount } from 'wagmi';

const paginationStep = 8;

export default function CouncilNominees() {
	const { query } = useRouter();
	const { t } = useTranslation();
	const { data } = useAccount();
	const [activePage, setActivePage] = useState(0);
	const activeCouncil = parseQuery(query?.council?.toString());
	const nomineesQuery = useNomineesQuery(activeCouncil.module);
	const isNominatedQuery = useIsNominatedForCouncilInNominationPeriod(data?.address || '');
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

	const sortedNominees =
		nomineesQuery.data && [...nomineesQuery.data].sort((a) => (a === data?.address ? -1 : 1));
	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				{!isNominatedQuery.data?.length && (
					<NominateSelfBanner deployedModule={activeCouncil.module} />
				)}
				<div className="container">
					<div className="w-full relative p-10">
						<BackButton />
						<h1 className="tg-title-h1 text-center">
							{t('councils.nominees', { council: capitalizeString(query.council?.toString()) })}
						</h1>
					</div>
					<span className="tg-content text-gray-500 text-center block pt-[8px] mb-4 p-2">
						{t('councils.subline')}
					</span>
					{nomineesQuery.isLoading && !nomineesQuery.data ? (
						<Loader className="flex justify-center" />
					) : !!nomineesQuery.data?.length ? (
						<>
							<div className="flex flex-wrap justify-center p-3 max-w-[1000px] mx-auto">
								{sortedNominees?.slice(startIndex, endIndex).map((walletAddress) => (
									<MemberCard
										className="m-2"
										walletAddress={walletAddress}
										key={walletAddress}
										state="NOMINATION"
										deployedModule={activeCouncil.module}
										council={activeCouncil.name}
									/>
								))}
							</div>
							<div className="w-full">
								<div className="w-full flex justify-around items-center gap-5 max-w-[330px] mx-auto p-10">
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
							</div>
						</>
					) : (
						<h4 className="tg-title-h4 text-center">{t('councils.no-nominations')}</h4>
					)}
				</div>
			</Main>
		</>
	);
}

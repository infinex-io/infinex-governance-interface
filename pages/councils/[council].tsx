import { Pagination } from '@synthetixio/ui';
import BackButton from 'components/BackButton';

import { Loader } from 'components/Loader/Loader';
import Main from 'components/Main';
import MemberCard from 'components/MemberCard/Index';
import { DeployedModules } from 'containers/Modules';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';

import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from 'utils/capitalize';
import { parseQuery } from 'utils/parse';
import { useConnectorContext } from 'containers/Connector';
import { compareAddress } from 'utils/helpers';
import { COUNCIL_SLUGS } from 'constants/config';

const PAGE_SIZE = 8;

export default function CouncilNominees() {
	const { query } = useRouter();
	const parsedQuery = query.council?.toString()
		? COUNCIL_SLUGS.includes(query?.council?.toString())
			? query.council.toString()
			: 'trade'
		: 'trade';
	const { t } = useTranslation();
	const { walletAddress } = useConnectorContext();
	const [activePage, setActivePage] = useState(0);
	const activeCouncil = parseQuery(query?.council?.toString());
	const nomineesQuery = useNomineesQuery(activeCouncil.module);

	const isAlreadyNominatedForTrade = useIsNominated(
		DeployedModules.TRADE_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForEcosystem = useIsNominated(
		DeployedModules.CORE_CONTRIBUTORS_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForCoreContributor = useIsNominated(
		DeployedModules.ECOSYSTEM_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForTreasury = useIsNominated(
		DeployedModules.TREASURY_COUNCIL,
		walletAddress || ''
	);

	const isAlreadyNominated =
		isAlreadyNominatedForTrade.data ||
		isAlreadyNominatedForEcosystem.data ||
		isAlreadyNominatedForCoreContributor.data ||
		isAlreadyNominatedForTreasury.data;
	const startIndex = activePage * PAGE_SIZE;
	const endIndex =
		nomineesQuery.data?.length && startIndex + PAGE_SIZE > nomineesQuery.data?.length
			? nomineesQuery.data!.length
			: startIndex + PAGE_SIZE;

	const sortedNominees =
		nomineesQuery.data &&
		[...nomineesQuery.data].sort((a) => (compareAddress(a, walletAddress) ? -1 : 1));

	return (
		<>
			<Head>
				<title>Infinex | Governance V3</title>
			</Head>
			<Main>
				<div className="container">
					<div className="w-full relative p-10">
						<BackButton />
						<h1 className="tg-title-h1 text-center">
							{t('councils.nominees', { council: capitalizeString(parsedQuery) })}
						</h1>
					</div>
					<span className="tg-content text-gray-500 text-center block pt-[8px] mb-4 p-2">
						{t('councils.subline')}
					</span>
					{nomineesQuery.isLoading && !nomineesQuery.data ? (
						<Loader className="flex justify-center" />
					) : !!nomineesQuery.data?.length ? (
						<>
							<div className="flex flex-wrap justify-center p-3 max-w-[1000px] w-full mx-auto">
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
						<h4 className="tg-title-h4 text-center">{t('councils.no-nominations')}</h4>
					)}
				</div>
			</Main>
		</>
	);
}

import { Pagination } from '@synthetixio/ui';
import BackButton from 'components/BackButton';
import NominateSelfBanner from 'components/Banners/NominateSelfBanner';
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

const PAGE_SIZE = 8;

export default function CouncilNominees() {
	const { query } = useRouter();
	const { t } = useTranslation();
	const { walletAddress } = useConnectorContext();
	const [activePage, setActivePage] = useState(0);
	const activeCouncil = parseQuery(query?.council?.toString());
	const nomineesQuery = useNomineesQuery(activeCouncil.module);
	const isAlreadyNominatedForSpartan = useIsNominated(
		DeployedModules.SPARTAN_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForGrants = useIsNominated(
		DeployedModules.GRANTS_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForAmbassador = useIsNominated(
		DeployedModules.AMBASSADOR_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForTreasury = useIsNominated(
		DeployedModules.TREASURY_COUNCIL,
		walletAddress || ''
	);

	const isAlreadyNominated =
		isAlreadyNominatedForSpartan.data ||
		isAlreadyNominatedForGrants.data ||
		isAlreadyNominatedForAmbassador.data ||
		isAlreadyNominatedForTreasury.data;
	const startIndex = activePage * PAGE_SIZE;
	const endIndex =
		nomineesQuery.data?.length && startIndex + PAGE_SIZE > nomineesQuery.data?.length
			? nomineesQuery.data!.length
			: startIndex + PAGE_SIZE;

	const sortedNominees =
		nomineesQuery.data && [...nomineesQuery.data].sort((a) => (a === walletAddress ? -1 : 1));

	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				{!isAlreadyNominated && <NominateSelfBanner deployedModule={activeCouncil.module} />}
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

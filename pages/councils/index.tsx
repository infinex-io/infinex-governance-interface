import type { NextPage } from 'next';
import Head from 'next/head';
import Main from 'components/Main';
import { useTranslation } from 'react-i18next';
import BackButton from 'components/BackButton';
import { Tabs } from '@synthetixio/ui';
import { useRouter } from 'next/router';
import { useAllCouncilMembersAddresses } from 'queries/members/useAllCouncilMembersAddresses';
import { COUNCILS_DICTIONARY } from 'constants/config';
import { parseQuery } from 'utils/parse';
import MemberCard from 'components/MemberCard/Index';
import { Loader } from 'components/Loader/Loader';
import { TabIcon } from 'components/TabIcon';
import { useState } from 'react';
import { Timer } from 'components/Timer';
import useNextEpochDatesQuery from 'queries/epochs/useNextEpochDatesQuery';

const Councils: NextPage = () => {
	const { query } = useRouter();
	const [activeCouncil, setActiveCouncil] = useState(parseQuery(query?.council?.toString()).name);
	const { t } = useTranslation();
	const nextEpochs = COUNCILS_DICTIONARY.map((council) => useNextEpochDatesQuery(council.module));
	// TODO @MF fix it
	const members = useAllCouncilMembersAddresses();
	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				<div className="flex flex-col items-center p-3 container">
					<div className="w-full relative">
						<BackButton />
						<h1 className="tg-title-h1 text-center p-12 ml-auto">{t('councils.headline')}</h1>
					</div>
					<Tabs
						initial={activeCouncil}
						className="overflow-x-auto h-[60px] no-scrollbar"
						items={COUNCILS_DICTIONARY.map((council, index) => ({
							id: council.slug,
							label: (
								<div className="flex items-center gap-1">
									{t(`councils.tabs.${council.abbreviation}`)}
									<TabIcon isActive={activeCouncil === council.slug}>
										{members.data && members.data[council.slug].length}
									</TabIcon>
								</div>
							),
							content: members.isLoading ? (
								<Loader className="mt-8" />
							) : (
								<>
									<div className="py-10 px-6 border-[1px] border-gray-500 rounded">
										<span className="tg-caption">
											{t(`councils.tabs.explanations.${council.abbreviation}.subline`)}
										</span>
										<div className="flex justify-evenly flex-wrap">
											<div className="border-[1px] border-gray-500 rounded">
												<span>
													{t(`councils.tabs.explanations.${council.abbreviation}.election`)}
												</span>
												<span>
													{t(`councils.tabs.explanations.${council.abbreviation}.members`, {
														count: members.data && members.data[council.slug].length,
													})}
												</span>
											</div>
											<div className="border-[1px] border-gray-500 rounded">
												<span>
													{t(`councils.tabs.explanations.${council.abbreviation}.stipends`)}
												</span>
												<span>
													{t(`councils.tabs.explanations.${council.abbreviation}.amount`, {
														amount: '2000 SNX',
													})}
												</span>
											</div>
											<div className="border-[1px] border-gray-500 rounded">
												<span>
													{t(`councils.tabs.explanations.${council.abbreviation}.nextElection`)}
												</span>
												<Timer expiryTimestamp={nextEpochs[index].data?.epochStartDate || 0} />
											</div>
										</div>
									</div>
									<div className="flex flex-wrap justify-center w-full">
										{members.data &&
											members.data[council.slug]?.map((walletAddress) => (
												<MemberCard
													className="m-2"
													key={walletAddress}
													walletAddress={walletAddress}
													state="ADMINISTRATION"
													council={activeCouncil}
												/>
											))}
									</div>
								</>
							),
						}))}
						onChange={(id) => setActiveCouncil(id as any)}
					/>
				</div>
			</Main>
		</>
	);
};

export default Councils;

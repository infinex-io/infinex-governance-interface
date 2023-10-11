import type { NextPage } from 'next';
import Head from 'next/head';
import Main from 'components/Main';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'components/Tabs/Tabs';
import BackButton from 'components/BackButton';
import { useRouter } from 'next/router';
import { COUNCILS_DICTIONARY } from 'constants/config';
import { parseQuery } from 'utils/parse';
import MemberCard from 'components/MemberCard/Index';
import { Loader } from 'components/Loader/Loader';
import { TabIcon } from 'components/TabIcon';
import { useCallback, useState } from 'react';
import { PassedVotingResults } from 'components/Vote/PassedVotingResult';
import useCouncilMembersQuery from 'queries/members/useCouncilMembersQuery';
import { DeployedModules } from 'containers/Modules';
import { init } from 'i18next';
import useCouncilCardQueries from 'hooks/useCouncilCardQueries';

const Councils: NextPage = () => {
	const { query } = useRouter();
	const [activeCouncil, setActiveCouncil] = useState(parseQuery(query?.council?.toString()).name);
	const { t } = useTranslation();
	const { data: trade } = useCouncilMembersQuery(DeployedModules.TRADE_COUNCIL);
	let { data: initEcosystem } = useCouncilMembersQuery(DeployedModules.ECOSYSTEM_COUNCIL);
	const { currentPeriodData : ecosystemPeriod } = useCouncilCardQueries(DeployedModules.ECOSYSTEM_COUNCIL);
	const period = ecosystemPeriod?.currentPeriod;
	let ecosystem;
	// nominations or voting, add extra seat to ecosystem
	if (initEcosystem && (period === "VOTING" || period === "NOMINATION")) {
		ecosystem = [...initEcosystem]; // Create a shallow copy of the array
		ecosystem.push(ecosystem[0]);
	}
	// if not nominations or voting
	else if (initEcosystem) {
		ecosystem = initEcosystem
	}

	const { data: coreContributor } = useCouncilMembersQuery(DeployedModules.CORE_CONTRIBUTOR_COUNCIL);
	const { data: treasury } = useCouncilMembersQuery(DeployedModules.TREASURY_COUNCIL);
	
	const allMembers = [trade, ecosystem, coreContributor, treasury];
	const moduleInstance = COUNCILS_DICTIONARY.find((item) => item.slug === activeCouncil)?.module;
	return (
		<>
			<Head>
				<title>Infinex | Governance V3</title>
			</Head>
			<Main>
				<div className="flex flex-col p-3 container">
					<div className="w-full relative">
						<h1 className="tg-title-h1 text-center p-12 ml-auto">{t('councils.headline')}</h1>
					</div>

					<Tabs
						initial={activeCouncil}
						className="mb-2 justify-start lg:mx-auto no-scrollbar"
						tabClassName="min-w-fit"
						items={COUNCILS_DICTIONARY.map((council, index) => ({
							id: council.slug,
							label: (
								<div className="flex items-center gap-1">
									{t(`councils.tabs.${council.abbreviation}`)}
									<TabIcon isActive={activeCouncil === council.slug}>
										{allMembers[index]?.length}
									</TabIcon>
								</div>
							),
							content: !allMembers.length ? (
								<Loader className="mt-8 mx-auto w-fit" />
							) : (
								<>
									<div className="mt-4 mb-3 p-6 max-w-3xl mx-auto text-slate-100">
										<span className="tg-content text-center block">
											{t(`councils.tabs.explanations.${council.abbreviation}.subline`)}
										</span>
										<div className="flex justify-center flex-wrap mt-9 md:flex-nowrap">
											<div className="rounded p-2 flex flex-col justify-center items-center w-full mx-8 my-2">
												<span className="uppercase mb-2 text-xs font-medium">
													{t(`councils.tabs.explanations.${council.abbreviation}.election`)}
												</span>
												<span className="font-bold text-sm">
													{t(`councils.tabs.explanations.${council.abbreviation}.members`, {
														count: allMembers[index]?.length,
													})}
												</span>
											</div>
											<div className="rounded p-2 flex flex-col justify-center items-center w-full mx-8 my-2">
												<span className="uppercase mb-2 text-xs font-medium">
													{t(`councils.tabs.explanations.${council.abbreviation}.stipends`)}
												</span>
												<span className="font-bold text-sm">
													{t(`councils.tabs.explanations.${council.abbreviation}.amount`, {
														amount: '1,000',
													})}
												</span>
											</div>
										</div>
									</div>
									<div className="flex flex-wrap justify-center w-full">
										{allMembers.length &&
											allMembers[index]?.map((walletAddress) => (
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


					{moduleInstance && <PassedVotingResults moduleInstance={moduleInstance} />}
				</div>
			</Main>
		</>
	);
};
export default Councils;

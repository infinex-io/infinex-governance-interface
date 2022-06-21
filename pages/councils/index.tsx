import type { NextPage } from 'next';
import Head from 'next/head';
import Main from 'components/Main';
import { useRouter } from 'next/router';
import { Tabs } from 'components/old-ui';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import MemberCard from 'components/MemberCard/Index';
import { parseQuery } from 'utils/parse';
import BackButton from 'components/BackButton';
import { Loader } from 'components/Loader/Loader';
import { TabIcon } from 'components/TabIcon';
import { useAllCouncilMembersAddresses } from 'queries/members/useAllCouncilMembersAddresses';

const Councils: NextPage = () => {
	const { query } = useRouter();
	const [activeCouncil, setActiveCouncil] = useState(parseQuery(query?.council?.toString()));
	const { t } = useTranslation();
	const members = useAllCouncilMembersAddresses();
	const councilTabs = [
		t('landing-page.tabs.sc'),
		t('landing-page.tabs.gc'),
		t('landing-page.tabs.ac'),
		t('landing-page.tabs.tc'),
	];

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
						className="overflow-x-auto h-[60px] no-scrollbar"
						titles={councilTabs}
						activeIndex={activeCouncil.index}
						clicked={(index) => {
							if (typeof index === 'number') setActiveCouncil(parseQuery(index));
						}}
						icons={[
							<TabIcon key="spartan-council-tab" isActive={activeCouncil.index === 0}>
								{members.data?.spartan?.length}
							</TabIcon>,
							<TabIcon key="grants-council-tab" isActive={activeCouncil.index === 1}>
								{members.data?.grants?.length}
							</TabIcon>,
							<TabIcon key="ambassador-council-tab" isActive={activeCouncil.index === 2}>
								{members.data?.ambassador?.length}
							</TabIcon>,
							<TabIcon key="treasury-council-tab" isActive={activeCouncil.index === 3}>
								{members.data?.treasury?.length}
							</TabIcon>,
						]}
					/>
					{members.data?.spartan &&
					members.data?.grants &&
					members.data?.ambassador &&
					members.data?.treasury ? (
						<div className="flex flex-wrap justify-center w-full">
							{members.data[activeCouncil.name]?.map((walletAddress) => (
								<MemberCard
									className="m-2"
									key={walletAddress}
									walletAddress={walletAddress}
									state="ADMINISTRATION"
									council={activeCouncil.name}
								/>
							))}
						</div>
					) : (
						<Loader className="mt-8" />
					)}
				</div>
			</Main>
		</>
	);
};

export default Councils;

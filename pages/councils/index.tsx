import type { NextPage } from 'next';
import Head from 'next/head';
import Main from 'components/Main';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Tabs } from 'components/old-ui';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import useAllCouncilMembersQuery from 'queries/members/useAllCouncilMembersQuery';
import MemberCard from 'components/MemberCard/Index';
import { parseQuery } from 'utils/parse';
import BackButton from 'components/BackButton';

const Councils: NextPage = () => {
	const { query } = useRouter();
	const [activeCouncil, setActiveCouncil] = useState(parseQuery(query?.council?.toString()));
	const { t } = useTranslation();
	const members = useAllCouncilMembersQuery();
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
				<div className="flex flex-col items-center">
					<BackButton />
					<h1 className="tg-title-h1">{t('councils.headline')}</h1>
					<Tabs
						titles={councilTabs}
						activeIndex={activeCouncil.index}
						clicked={(index) => {
							if (typeof index === 'number') setActiveCouncil((state) => ({ ...state, index }));
						}}
						justifyContent="center"
						icons={[
							<StyledTabIcon key="spartan-council-tab" active={activeCouncil.index === 0}>
								{members.data?.spartan?.length}
							</StyledTabIcon>,
							<StyledTabIcon key="grants-council-tab" active={activeCouncil.index === 1}>
								{members.data?.grants?.length}
							</StyledTabIcon>,
							<StyledTabIcon key="ambassador-council-tab" active={activeCouncil.index === 2}>
								{members.data?.ambassador?.length}
							</StyledTabIcon>,
							<StyledTabIcon key="treasury-council-tab" active={activeCouncil.index === 3}>
								{members.data?.treasury?.length}
							</StyledTabIcon>,
						]}
					/>
					{members.data?.spartan &&
					members.data?.grants &&
					members.data?.ambassador &&
					members.data?.treasury ? (
						<div className="flex flex-wrap justify-center">
							{members.data[activeCouncil.name].map((member) => (
								<MemberCard key={member.address} member={member} />
							))}
						</div>
					) : (
						<span>loading...</span>
					)}
				</div>
			</Main>
		</>
	);
};

const StyledTabIcon = styled.span<{ active?: boolean }>`
	background-color: ${({ theme, active }) =>
		active ? theme.colors.black : theme.colors.lightBlue};
	border-radius: 15px;
	color: ${({ theme, active }) => (active ? theme.colors.white : theme.colors.black)};
	padding: 0px 8px;
	font-size: 0.66rem;
	font-family: 'Inter Bold';
`;

export default Councils;

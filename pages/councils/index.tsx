import type { NextPage } from 'next';
import Head from 'next/head';
import Main from 'components/Main';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ArrowLeftIcon, Button, Card, Flex, IconButton, Tabs, Dropdown } from 'components/old-ui';
import { useTranslation } from 'react-i18next';
import { H1 } from 'components/Headlines/H1';
import { useState } from 'react';
import useAllCouncilMembersQuery from 'queries/members/useAllCouncilMembersQuery';
import { Text } from 'components/Text/text';
import { TextBold } from 'components/Text/bold';
import { capitalizeString } from 'utils/capitalize';
import { DeployedModules } from 'containers/Modules/Modules';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import useUsersDetailsQuery from 'queries/boardroom/useUsersDetailsQuery';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import Connector from 'containers/Connector';
import NominateSelfBanner from 'components/Banners/NominateSelfBanner';
import MemberCard from 'components/MemberCard/Index';
import { parseQuery } from 'utils/parse';

const Councils: NextPage = () => {
	const { query, push } = useRouter();
	const [activeCouncil, setActiveCouncil] = useState(parseQuery(query?.council?.toString()));
	const { walletAddress } = Connector.useContainer();
	const isNominated = useIsNominated(
		parseQuery(query?.council?.toString()).module,
		walletAddress ? walletAddress : ''
	);
	const { t } = useTranslation();
	const members = useAllCouncilMembersQuery();
	const { data } = useNomineesQuery(parseQuery(query?.council?.toString()).module);
	const nomineesInfo = useUsersDetailsQuery(data ? data : []);
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
				<Flex direction="column" alignItems="center">
					<StyledBackIconWrapper alignItems="center">
						<IconButton active onClick={() => push({ pathname: '/' })} rounded size="tiniest">
							<ArrowLeftIcon active />
						</IconButton>
						<TextBold color="lightBlue">{t('councils.back-btn')}</TextBold>
					</StyledBackIconWrapper>
					{query?.nominees && query.council ? (
						<>
							{!isNominated.data && <NominateSelfBanner />}
							<H1>
								{t('councils.nominees', { council: capitalizeString(query.council?.toString()) })}
							</H1>
							{!!nomineesInfo.data?.length && (
								<Flex wrap>
									{nomineesInfo.data.map((member) => (
										<MemberCard member={member} />
									))}
								</Flex>
							)}
						</>
					) : (
						<>
							<H1>{t('councils.headline')}</H1>
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
								<Flex wrap justifyContent="center">
									{members.data[activeCouncil.name].map((member) => (
										<MemberCard member={member} />
									))}
								</Flex>
							) : (
								<span>loading...</span>
							)}
						</>
					)}
				</Flex>
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

const StyledCard = styled(Card)`
	width: 200px;
	margin: 40px;
`;

const StyledCardContent = styled(Flex)`
	width: 100%;
	height: 100%;
	padding: ${({ theme }) => theme.spacings.tiny};
	position: relative;
`;

const StyledCardImage = styled.img`
	width: 56px;
	height: 56px;
	border-radius: 50%;
`;
const StyledButton = styled(Button)`
	width: 100px;
`;

const StyledBackIconWrapper = styled(Flex)`
	position: absolute;
	top: 110px;
	left: ${({ theme }) => theme.spacings.biggest};
	> * {
		margin-right: ${({ theme }) => theme.spacings.medium};
	}
`;

const StyledDropdown = styled(Dropdown)`
	position: absolute;
	bottom: -50px;
	width: 200px;
`;

const StyledDropdownText = styled(Text)`
	padding: ${({ theme }) => theme.spacings.tiniest};
	cursor: pointer;
	width: 100%;
`;

export default Councils;

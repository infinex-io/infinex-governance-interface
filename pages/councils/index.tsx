import type { NextPage } from 'next';
import Head from 'next/head';
import Main from 'components/Main';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
	ArrowLeftIcon,
	Button,
	Card,
	DiscordIcon,
	Flex,
	IconButton,
	Tabs,
	TwitterIcon,
} from '@synthetixio/ui';
import { useTranslation } from 'react-i18next';
import { H1 } from 'components/Headlines/H1';
import { useState } from 'react';
import { parseURL } from 'utils/ipfs';
import useAllCouncilMembersQuery from 'queries/members/useAllCouncilMembersQuery';
import { H5 } from 'components/Headlines/H5';
import { Text } from 'components/Text/text';
import { TextBold } from 'components/Text/bold';
import { capitalizeString } from 'utils/capitalize';
import { DeployedModules } from 'containers/Modules/Modules';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import useUsersDetailsQuery from 'queries/boardroom/useUsersDetailsQuery';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import Connector from 'containers/Connector';
import NominateSelfBanner from 'components/Banners/NominateSelfBanner';

const Councils: NextPage = () => {
	const { query, push } = useRouter();
	const parseQuery = (council?: string) => {
		switch (council) {
			case 'spartan':
				return { index: 0, module: DeployedModules.SPARTAN_COUNCIL };
			case 'grants':
				return { index: 1, module: DeployedModules.GRANTS_COUNCIL };
			case 'ambassador':
				return { index: 2, module: DeployedModules.AMBASSADOR_COUNCIL };
			case 'treasury':
				return { index: 3, module: DeployedModules.TREASURY_COUNCIL };
			default:
				return { index: 0, module: DeployedModules.SPARTAN_COUNCIL };
		}
	};
	const [activeCouncil, setActiveCouncil] = useState(parseQuery(query?.council?.toString()).index);
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

	const getMembers = (index: number, isNominees?: boolean) => {
		const council = Object.keys(members.data!)[index] as
			| 'spartan'
			| 'grants'
			| 'ambassador'
			| 'treasury';
		return (isNominees ? nomineesInfo.data! : members.data![council]).map((member) => (
			<StyledCard
				color={walletAddress === member.address ? 'orange' : 'purple'}
				key={member.address}
			>
				<StyledCardContent className="darker-60" direction="column" alignItems="center">
					<StyledCardImage src={parseURL(member.pfpThumbnailUrl)} />
					<H5>{member.ens || member.username}</H5>
					<Text>{member.about}</Text>
					{member.discord && <DiscordIcon />}
					{member.twitter && <TwitterIcon />}
					<StyledButton
						variant="secondary"
						onClick={() => {
							push({
								pathname: 'councils',
								query: {
									member: member.address,
								},
							});
						}}
					>
						{t('landing-page.tabs.view-member')}
					</StyledButton>
				</StyledCardContent>
			</StyledCard>
		));
	};
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
							{!!nomineesInfo.data?.length && <Flex wrap>{getMembers(activeCouncil, true)}</Flex>}
						</>
					) : (
						<>
							<H1>{t('councils.headline')}</H1>
							<Tabs
								titles={councilTabs}
								activeIndex={activeCouncil}
								clicked={(index) => {
									if (typeof index === 'number') setActiveCouncil(index);
								}}
								justifyContent="center"
								icons={[
									<StyledTabIcon key="spartan-council-tab" active={activeCouncil === 0}>
										{members.data?.spartan?.length}
									</StyledTabIcon>,
									<StyledTabIcon key="grants-council-tab" active={activeCouncil === 1}>
										{members.data?.grants?.length}
									</StyledTabIcon>,
									<StyledTabIcon key="ambassador-council-tab" active={activeCouncil === 2}>
										{members.data?.ambassador?.length}
									</StyledTabIcon>,
									<StyledTabIcon key="treasury-council-tab" active={activeCouncil === 3}>
										{members.data?.treasury?.length}
									</StyledTabIcon>,
								]}
							/>
							{members.data?.spartan &&
							members.data.grants &&
							members.data.ambassador &&
							members.data.treasury ? (
								<Flex wrap justifyContent="center">
									{getMembers(activeCouncil)}
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

export default Councils;

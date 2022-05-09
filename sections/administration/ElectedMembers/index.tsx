import { ArrowDropdownLeftIcon, Card, Flex, IconButton, Tabs } from '@synthetixio/ui';
import { DeployedModules } from 'containers/Modules/Modules';
import { useRouter } from 'next/router';
import useCouncilMembersQuery from 'queries/members/useCouncilMembersQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function ElectedMembers() {
	const { push } = useRouter();
	const { t } = useTranslation();
	const [activeIndex, setActiveIndex] = useState(0);
	const councilTabs = [
		t('landing-pages.council-tabs.spartan'),
		t('landing-pages.council-tabs.grants'),
		t('landing-pages.council-tabs.ambassador'),
		t('landing-pages.council-tabs.treasury'),
	];

	const { data: spartanMembers } = useCouncilMembersQuery(DeployedModules.SPARTAN_COUNCIL);
	const { data: ambassadorMembers } = useCouncilMembersQuery(DeployedModules.AMBASSADOR_COUNCIL);
	const { data: grantsMembers } = useCouncilMembersQuery(DeployedModules.GRANTS_COUNCIL);
	const { data: treasuryMembers } = useCouncilMembersQuery(DeployedModules.TREASURY_COUNCIL);

	return (
		<StyledElectedMembersWrapper direction="column" alignItems="center">
			<StyledHeadline>
				<IconButton onClick={() => push({ pathname: '/elections' })} rounded active>
					<ArrowDropdownLeftIcon active={true} />
				</IconButton>
				{t('elections.elected.headline')}
			</StyledHeadline>
			<Tabs
				titles={councilTabs}
				clicked={(index) => typeof index === 'number' && setActiveIndex(index)}
				justifyContent="center"
				activeIndex={activeIndex}
				icons={[
					<StyledTabIcon key="spartan-council-tab" active={activeIndex === 0}>
						{spartanMembers?.length}
					</StyledTabIcon>,
					<StyledTabIcon key="ambassador-council-tab" active={activeIndex === 1}>
						{ambassadorMembers?.length}
					</StyledTabIcon>,
					<StyledTabIcon key="grants-council-tab" active={activeIndex === 2}>
						{grantsMembers?.length}
					</StyledTabIcon>,
					<StyledTabIcon key="treasury-council-tab" active={activeIndex === 3}>
						{treasuryMembers?.length}
					</StyledTabIcon>,
				]}
			/>
			<Flex wrap>
				<StyledMemberCard withBackgroundColor="backgroundColor"></StyledMemberCard>
			</Flex>
		</StyledElectedMembersWrapper>
	);
}

const StyledElectedMembersWrapper = styled(Flex)`
	padding-top: 64px;
`;

const StyledHeadline = styled.h1`
	font-family: 'Inter Bold';
	font-family: 3.33rem;
`;

const StyledTabIcon = styled.span<{ active?: boolean }>`
	background-color: ${({ theme, active }) =>
		active ? theme.colors.black : theme.colors.lightBlue};
	border-radius: 15px;
	color: ${({ theme, active }) => (active ? theme.colors.white : theme.colors.black)};
	padding: 0px 8px;
	font-size: 0.66rem;
	font-family: 'Inter Bold';
`;

const StyledMemberCard = styled(Card)``;

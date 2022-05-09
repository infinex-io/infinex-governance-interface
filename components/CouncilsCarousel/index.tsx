import { Button, Card, Carousel, Flex, Tabs } from '@synthetixio/ui';
import { DeployedModules } from 'containers/Modules/Modules';
import useCouncilMembersQuery from 'queries/members/useCouncilMembersQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface CouncilsCarouselProps {
	maxWidth?: string;
	startIndex?: number;
}

export default function CouncilsCarousel({ maxWidth, startIndex }: CouncilsCarouselProps) {
	const { t } = useTranslation();
	const [activeIndex, setActiveIndex] = useState(0);
	const councilTabs = [
		t('landing-pages.council-tabs.all'),
		t('landing-pages.council-tabs.spartan'),
		t('landing-pages.council-tabs.grants'),
		t('landing-pages.council-tabs.ambassador'),
		t('landing-pages.council-tabs.treasury'),
	];

	const { data: spartanMembers } = useCouncilMembersQuery(DeployedModules.SPARTAN_COUNCIL);
	const { data: ambassadorMembers } = useCouncilMembersQuery(DeployedModules.AMBASSADOR_COUNCIL);
	const { data: grantsMembers } = useCouncilMembersQuery(DeployedModules.GRANTS_COUNCIL);
	const { data: treasuryMembers } = useCouncilMembersQuery(DeployedModules.TREASURY_COUNCIL);
	const allMembers =
		spartanMembers?.length &&
		ambassadorMembers?.length &&
		grantsMembers?.length &&
		treasuryMembers?.length &&
		spartanMembers?.concat(ambassadorMembers, grantsMembers, treasuryMembers);

	return (
		<Flex direction="column" alignItems="center">
			<Tabs
				titles={councilTabs}
				clicked={(index) => typeof index === 'number' && setActiveIndex(index)}
				justifyContent="center"
				activeIndex={activeIndex}
				icons={[
					<StyledTabIcon key="all-council-members" active={activeIndex === 0}>
						{Array.isArray(allMembers) && allMembers.length}
					</StyledTabIcon>,
					<StyledTabIcon key="spartan-council-tab" active={activeIndex === 1}>
						{spartanMembers?.length}
					</StyledTabIcon>,
					<StyledTabIcon key="ambassador-council-tab" active={activeIndex === 2}>
						{ambassadorMembers?.length}
					</StyledTabIcon>,
					<StyledTabIcon key="grants-council-tab" active={activeIndex === 3}>
						{grantsMembers?.length}
					</StyledTabIcon>,
					<StyledTabIcon key="treasury-council-tab" active={activeIndex === 4}>
						{treasuryMembers?.length}
					</StyledTabIcon>,
				]}
			/>
			<Carousel
				startIndex={startIndex ? startIndex : 1}
				widthOfItems={300}
				carouselItems={[
					<StyledCarouselCard withBackgroundColor="darkBlue">
						Test Test Test Test Test Test
					</StyledCarouselCard>,
					<StyledCarouselCard withBackgroundColor="darkBlue">Test</StyledCarouselCard>,
					<StyledCarouselCard withBackgroundColor="darkBlue">Test</StyledCarouselCard>,
					<StyledCarouselCard withBackgroundColor="darkBlue">Test</StyledCarouselCard>,
					<StyledCarouselCard withBackgroundColor="darkBlue">Test</StyledCarouselCard>,
				]}
				maxWidth={maxWidth ? maxWidth : '90vw'}
				arrowsPosition="outside"
				withDots="secondary"
				dotsPosition="outside"
			/>
		</Flex>
	);
}

const StyledTabIcon = styled.span<{ active?: boolean }>`
	background-color: ${({ theme, active }) =>
		active ? theme.colors.black : theme.colors.lightBlue};
	border-radius: 15px;
	color: ${({ theme, active }) => (active ? theme.colors.white : theme.colors.black)};
	padding: 0px 8px;
	font-size: 0.66rem;
	font-family: 'Inter Bold';
`;

const StyledCarouselCard = styled(Card)`
	min-width: 300px;
	margin: 40px;
`;

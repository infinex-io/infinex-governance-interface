import { Button, Card, Carousel, Tabs, theme } from '@synthetixio/ui';
import Flex from 'components/Flex';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function Councils() {
	const { t } = useTranslation();
	const [activeIndex, setActiveIndex] = useState(0);
	const councilTabs = [
		t('dashboard.council-tabs.all'),
		t('dashboard.council-tabs.spartan'),
		t('dashboard.council-tabs.grants'),
		t('dashboard.council-tabs.ambassador'),
		t('dashboard.council-tabs.treasury'),
	];

	return (
		<Flex direction="column" alignItems="center">
			<StyledCouncilHeader>{t('dashboard.elected-members')}</StyledCouncilHeader>
			<Tabs
				titles={councilTabs}
				onClick={(index) => setActiveIndex(index)}
				justifyContent="center"
				activeIndex={activeIndex}
				icons={[
					// TODO @DEV get the numbers of members of each council
					<StyledTabIcon key={1} active={activeIndex === 0}>
						1
					</StyledTabIcon>,
					<StyledTabIcon key={2} active={false}>
						1
					</StyledTabIcon>,
					<StyledTabIcon key={3} active={false}>
						1
					</StyledTabIcon>,
					<StyledTabIcon key={4} active={false}>
						1
					</StyledTabIcon>,
					<StyledTabIcon key={5} active={false}>
						112
					</StyledTabIcon>,
				]}
			/>
			<Carousel
				startIndex={1}
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
				maxWidth="90vw"
			/>
			<Button
				text={t('dashboard.view-all-members')}
				onClick={() => {}}
				variant="primary"
				size="medium"
			/>
			<StyledCardTimeWrapper>
				<Card withBorderColor={{ color: 'green', withGlow: true }}>Council</Card>
				<Card withBorderColor={{ color: 'green', withGlow: true }}>Council</Card>
				<Card withBorderColor={{ color: 'green', withGlow: true }}>Council</Card>
				<Card withBorderColor={{ color: 'green', withGlow: true }}>Council</Card>
			</StyledCardTimeWrapper>
		</Flex>
	);
}

const StyledCouncilHeader = styled.h1`
	font-family: 'Inter Bold';
	font-size: 3.66rem;
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

const StyledCarouselCard = styled(Card)`
	min-width: 300px;
	margin: 40px;
`;

const StyledCardTimeWrapper = styled.div`
	display: flex;
	justify-content: space-between;
`;

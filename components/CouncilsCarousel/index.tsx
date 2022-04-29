import { Button, Card, Carousel, Flex, Tabs } from '@synthetixio/ui';
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
		t('dashboard.council-tabs.all'),
		t('dashboard.council-tabs.spartan'),
		t('dashboard.council-tabs.grants'),
		t('dashboard.council-tabs.ambassador'),
		t('dashboard.council-tabs.treasury'),
	];

	return (
		<Flex direction="column" alignItems="center">
			<Tabs
				titles={councilTabs}
				clicked={(index) => index && setActiveIndex(index)}
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

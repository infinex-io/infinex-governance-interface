import { Card, Carousel } from '@synthetixio/ui';
import Flex from 'components/Flex';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function Elections() {
	const { t } = useTranslation();
	return (
		<Flex direction="column" alignItems="center">
			<StyledElectionsHeadline>{t('elections.headline')}</StyledElectionsHeadline>
			<Carousel
				maxWidth="90vw"
				widthOfItems={300}
				carouselItems={[
					<StyledCarouselCardsWrapper>
						<StyledCouncilCircleOuter>
							<StyledCouncilCircleInner></StyledCouncilCircleInner>
						</StyledCouncilCircleOuter>
						<StyledCarouselCards withBackgroundColor="darkBlue">test</StyledCarouselCards>
					</StyledCarouselCardsWrapper>,
					<StyledCarouselCardsWrapper>
						<StyledCouncilCircleOuter>
							<StyledCouncilCircleInner></StyledCouncilCircleInner>
						</StyledCouncilCircleOuter>
						<StyledCarouselCards withBackgroundColor="darkBlue">test</StyledCarouselCards>
					</StyledCarouselCardsWrapper>,
					<StyledCarouselCardsWrapper>
						<StyledCouncilCircleOuter>
							<StyledCouncilCircleInner></StyledCouncilCircleInner>
						</StyledCouncilCircleOuter>
						<StyledCarouselCards withBackgroundColor="darkBlue">test</StyledCarouselCards>
					</StyledCarouselCardsWrapper>,
					<StyledCarouselCardsWrapper>
						<StyledCouncilCircleOuter>
							<StyledCouncilCircleInner></StyledCouncilCircleInner>
						</StyledCouncilCircleOuter>
						<StyledCarouselCards withBackgroundColor="darkBlue">test</StyledCarouselCards>
					</StyledCarouselCardsWrapper>,
					<StyledCarouselCardsWrapper>
						<StyledCouncilCircleOuter>
							<StyledCouncilCircleInner></StyledCouncilCircleInner>
						</StyledCouncilCircleOuter>
						<StyledCarouselCards withBackgroundColor="darkBlue">test</StyledCarouselCards>
					</StyledCarouselCardsWrapper>,
				]}
				withFade
			/>
		</Flex>
	);
}

const StyledElectionsHeadline = styled.h1`
	margin: 0;
	text-align: center;
	font-family: 'Inter Bold';
	font-size: 3.33rem;
`;

const StyledCarouselCardsWrapper = styled.div`
	min-width: 330px;
	min-height: 420px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
`;

const StyledCarouselCards = styled(Card)`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const StyledCouncilCircleOuter = styled.div`
	border-radius: 50%;
	min-width: 112px;
	min-height: 112px;
	background: ${({ theme }) => theme.colors.gradients.rainbow};
	display: flex;
	justify-content: center;
	align-items: center;
`;

const StyledCouncilCircleInner = styled.div`
	background-color: ${({ theme }) => theme.colors.darkBlue};
	width: 99%;
	height: 99%;
	border-radius: 50%;
`;

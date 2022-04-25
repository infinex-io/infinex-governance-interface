import { Card, Carousel } from '@synthetixio/ui';
import Flex from 'components/Flex';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function Elections() {
	const { t } = useTranslation();
	return (
		<Flex direction="column" alignItems="center">
			<StyledElectionsHeadline>{t('elections.headline')}</StyledElectionsHeadline>
			<Flex justifyContent="center">
				<StyledCard withBackgroundColor="darkBlue">
					<StyledCardContentWrapper>
						<StyledCouncilCircleOuter>
							<StyledCouncilCircleInner></StyledCouncilCircleInner>
						</StyledCouncilCircleOuter>
						test
					</StyledCardContentWrapper>
				</StyledCard>

				<StyledCard withBackgroundColor="darkBlue">
					<StyledCardContentWrapper>
						<StyledCouncilCircleOuter>
							<StyledCouncilCircleInner></StyledCouncilCircleInner>
						</StyledCouncilCircleOuter>
						test
					</StyledCardContentWrapper>
				</StyledCard>

				<StyledCard withBackgroundColor="darkBlue">
					<StyledCardContentWrapper>
						<StyledCouncilCircleOuter>
							<StyledCouncilCircleInner></StyledCouncilCircleInner>
						</StyledCouncilCircleOuter>
						test
					</StyledCardContentWrapper>
					test
				</StyledCard>

				<StyledCard withBackgroundColor="darkBlue">
					<StyledCardContentWrapper>
						<StyledCouncilCircleOuter>
							<StyledCouncilCircleInner></StyledCouncilCircleInner>
						</StyledCouncilCircleOuter>
						test
					</StyledCardContentWrapper>
				</StyledCard>

				<StyledCard withBackgroundColor="darkBlue">
					<StyledCardContentWrapper>
						<StyledCouncilCircleOuter>
							<StyledCouncilCircleInner></StyledCouncilCircleInner>
						</StyledCouncilCircleOuter>
						test
					</StyledCardContentWrapper>
				</StyledCard>
			</Flex>
		</Flex>
	);
}

const StyledElectionsHeadline = styled.h1`
	margin: 0;
	text-align: center;
	font-family: 'Inter Bold';
	font-size: 3.33rem;
`;

const StyledCard = styled(Card)`
	margin: ${({ theme }) => theme.spacings.margin.medium};
`;

const StyledCardContentWrapper = styled.div`
	height: 335px;
	width: 210px;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: ${({ theme }) => theme.spacings.margin.medium};
`;

const StyledCouncilCircleOuter = styled.div`
	border-radius: 50%;
	max-width: 72px;
	min-width: 72px;
	max-height: 72px;
	min-height: 72px;
	background: ${({ theme }) => theme.colors.gradients.rainbow};
	display: flex;
	justify-content: center;
	align-items: center;
`;

const StyledCouncilCircleInner = styled.div`
	background-color: ${({ theme }) => theme.colors.black};
	width: 70px;
	height: 70px;
	border-radius: 50%;
`;

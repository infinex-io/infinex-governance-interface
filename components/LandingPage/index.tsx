import { Flex } from '@synthetixio/ui';
import ButtonCards from '@synthetixio/ui/dist/esm/components/ButtonCard';
import RemainingTime from 'components/RemainingTime';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { parseRemainingTime } from 'utils/time';

interface LandingPageProps {
	remainingTime?: number;
	headline?: string;
}

export default function LandingPage({
	remainingTime,
	headline,
	children,
}: PropsWithChildren<LandingPageProps>) {
	const { t } = useTranslation();
	return (
		<>
			<SNXStar direction="column" justifyContent="center" alignItems="center">
				{remainingTime && <StyledNumber glow>{parseRemainingTime(remainingTime)}</StyledNumber>}
				<StyledStarHeadline>
					{headline ? headline : t('landing-pages.nomination.next-election')}
				</StyledStarHeadline>
				<StyledButtonsWrapper>
					<StyledRow justifyContent="center">
						{/* 					<ButtonCards
							onClick={() => {}}
							arrowDirection="right"
							headline={t('landing-pages.nomination.view-council-members')}
							subline={t('landing-pages.nomination.view-council-members-subline')}
						/>
						<ButtonCards
							onClick={() => {}}
							arrowDirection="right"
							headline={t('landing-pages.nomination.view-council-members')}
							subline={t('landing-pages.nomination.view-council-members-subline')}
						/>
					</StyledRow>
					<StyledRow justifyContent="center">
						<ButtonCards
							onClick={() => {}}
							arrowDirection="right"
							headline={t('landing-pages.nomination.view-council-members')}
							subline={t('landing-pages.nomination.view-council-members-subline')}
						/>
						<ButtonCards
							onClick={() => {}}
							arrowDirection="right"
							headline={t('landing-pages.nomination.view-council-members')}
							subline={t('landing-pages.nomination.view-council-members-subline')}
						/> */}
					</StyledRow>
				</StyledButtonsWrapper>
			</SNXStar>
			{children}
		</>
	);
}

const SNXStar = styled(Flex)`
	background-image: url('/images/snx-star.svg');
	width: 100%;
	min-height: 700px;
	background-position: center center;
	background-repeat: no-repeat;
	position: relative;
`;

const StyledNumber = styled(RemainingTime)`
	position: absolute;
	top: 45%;
	font-size: 2.33rem;
`;

const StyledStarHeadline = styled.h1`
	font-family: 'GT America Extended';
	font-stretch: expanded;
	font-size: 3.66rem;
	text-align: center;
	margin: 0;
	position: absolute;
	top: 50%;
`;

const StyledButtonsWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	position: absolute;
	top: 60%;
`;

const StyledRow = styled(Flex)`
	width: 100%;
	margin: 0px ${({ theme }) => theme.spacings.medium};
	> * {
		margin: ${({ theme }) => theme.spacings.big};
	}
`;

import { ArrowLinkOffIcon, Card, Flex } from '@synthetixio/ui';
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
						<StyledCard onClick={() => {}} withBorderColor={{ gradient: 'rainbow' }}>
							<StyledCardContent direction="column">
								<StyledButtonHeadline>
									{t('landing-pages.nomination.view-council-members')}{' '}
									<ArrowLinkOffIcon active={true} />
								</StyledButtonHeadline>
								<StyledButtonSubline>
									{t('landing-pages.nomination.view-council-members-subline')}
								</StyledButtonSubline>
							</StyledCardContent>
						</StyledCard>
						<StyledCard onClick={() => {}} withBorderColor={{ gradient: 'rainbow' }}>
							<StyledCardContent direction="column">
								<StyledButtonHeadline>
									{t('landing-pages.nomination.view-council-members')}{' '}
									<ArrowLinkOffIcon active={true} />
								</StyledButtonHeadline>
								<StyledButtonSubline>
									{t('landing-pages.nomination.view-council-members-subline')}
								</StyledButtonSubline>
							</StyledCardContent>
						</StyledCard>
					</StyledRow>
					<StyledRow justifyContent="center">
						<StyledCard onClick={() => {}} withBorderColor={{ gradient: 'rainbow' }}>
							<StyledCardContent direction="column">
								<StyledButtonHeadline>
									{t('landing-pages.nomination.view-council-members')}{' '}
									<ArrowLinkOffIcon active={true} />
								</StyledButtonHeadline>
								<StyledButtonSubline>
									{t('landing-pages.nomination.view-council-members-subline')}
								</StyledButtonSubline>
							</StyledCardContent>
						</StyledCard>
						<StyledCard onClick={() => {}} withBorderColor={{ gradient: 'rainbow' }}>
							<StyledCardContent direction="column">
								<StyledButtonHeadline>
									{t('landing-pages.nomination.view-council-members')}{' '}
									<ArrowLinkOffIcon active={true} />
								</StyledButtonHeadline>
								<StyledButtonSubline>
									{t('landing-pages.nomination.view-council-members-subline')}
								</StyledButtonSubline>
							</StyledCardContent>
						</StyledCard>
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
`;

const StyledButtonHeadline = styled.h3`
	font-family: 'GT America';
	font-weight: 700;
	margin: 0;
	color: ${({ theme }) => theme.colors.white};
	font-size: 1.13rem;
	display: flex;
	justify-content: space-between;
`;

const StyledButtonSubline = styled.div`
	font-family: 'Inter';
	font-size: 1.13rem;
	line-height: 21px;
	color: ${({ theme }) => theme.colors.grey};
	max-width: 350px;
`;

const StyledCard = styled(Card)`
	max-width: 460px;
	margin: ${({ theme }) => theme.spacings.tiny};
`;

const StyledCardContent = styled(Flex)`
	padding: 24px;
`;

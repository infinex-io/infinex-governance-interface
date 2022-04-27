import { ArrowLinkOffIcon, Card, Flex } from '@synthetixio/ui';
import styled from 'styled-components';
import useVotingPeriodDatesQuery from 'queries/epochs/useVotingPeriodDatesQuery';
import { DeployedModules } from 'containers/Modules/Modules';
import { useTranslation } from 'react-i18next';

export default function Election() {
	const { t } = useTranslation();
	const votingPeriodDatesQuery = useVotingPeriodDatesQuery(DeployedModules.SPARTAN_COUNCIL);
	return (
		<StyledSNXStar>
			<StyledNumber>
				{new Date(votingPeriodDatesQuery.data?.votingPeriodStartDate ?? 0).toLocaleDateString()}
			</StyledNumber>
			<StyledStarHeadline>{t('dashboard.next-election')}</StyledStarHeadline>
			<StyledButtonsWrapper>
				<StyledRow>
					<StyledCard onClick={() => {}} withBorderColor={{ gradient: 'rainbow' }}>
						<StyledCardContent direction="column">
							<StyledButtonHeadline>
								{t('dashboard.view-council-members')} <ArrowLinkOffIcon active={true} />
							</StyledButtonHeadline>
							<StyledButtonSubline>
								{t('dashboard.view-council-members-subline')}
							</StyledButtonSubline>
						</StyledCardContent>
					</StyledCard>
					<StyledCard onClick={() => {}} withBorderColor={{ gradient: 'rainbow' }}>
						<StyledCardContent direction="column">
							<StyledButtonHeadline>
								{t('dashboard.view-council-members')} <ArrowLinkOffIcon active={true} />
							</StyledButtonHeadline>
							<StyledButtonSubline>
								{t('dashboard.view-council-members-subline')}
							</StyledButtonSubline>
						</StyledCardContent>
					</StyledCard>
				</StyledRow>
				<StyledRow>
					<StyledCard onClick={() => {}} withBorderColor={{ gradient: 'rainbow' }}>
						<StyledCardContent direction="column">
							<StyledButtonHeadline>
								{t('dashboard.view-council-members')} <ArrowLinkOffIcon active={true} />
							</StyledButtonHeadline>
							<StyledButtonSubline>
								{t('dashboard.view-council-members-subline')}
							</StyledButtonSubline>
						</StyledCardContent>
					</StyledCard>
					<StyledCard onClick={() => {}} withBorderColor={{ gradient: 'rainbow' }}>
						<StyledCardContent direction="column">
							<StyledButtonHeadline>
								{t('dashboard.view-council-members')} <ArrowLinkOffIcon active={true} />
							</StyledButtonHeadline>
							<StyledButtonSubline>
								{t('dashboard.view-council-members-subline')}
							</StyledButtonSubline>
						</StyledCardContent>
					</StyledCard>
				</StyledRow>
			</StyledButtonsWrapper>
		</StyledSNXStar>
	);
}

const StyledSNXStar = styled.div`
	background-image: url('/images/snx-star.svg');
	width: 100%;
	min-height: 700px;
	background-position: center center;
	background-repeat: no-repeat;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
`;

const StyledNumber = styled.span`
	font-family: 'GT America Mono';
	font-size: 2.33rem;
	color: ${({ theme }) => theme.colors.green};
	position: absolute;
	top: 45%;
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

const StyledRow = styled.div`
	display: flex;
	justify-content: space-around;
	width: 100%;
	margin-bottom: ${({ theme }) => theme.spacings.medium};
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
`;

const StyledCardContent = styled(Flex)`
	padding: 24px;
`;

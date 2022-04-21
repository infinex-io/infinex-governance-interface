import { ArrowLinkOffIcon, Button, Spotlight, theme } from '@synthetixio/ui';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { DeployedModules } from 'containers/Modules/Modules';

import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import useNextEpochSeatCountQuery from 'queries/epochs/useNextEpochSeatCountQuery';
import useCurrentEpochDatesQuery from 'queries/epochs/useCurrentEpochDatesQuery';
import useNominationPeriodDatesQuery from 'queries/epochs/useNominationPeriodDatesQuery';
import useVotingPeriodDatesQuery from 'queries/epochs/useVotingPeriodDatesQuery';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import Councils from './Councils';

export default function Dashboard() {
	const { t } = useTranslation();
	/* 	const epochIndexQuery = useEpochIndexQuery(DeployedModules.SPARTAN_COUNCIL);
	const nextEpochSeatCountQuery = useNextEpochSeatCountQuery(DeployedModules.SPARTAN_COUNCIL);
	const currentEpochDatesQuery = useCurrentEpochDatesQuery(DeployedModules.SPARTAN_COUNCIL);
	const nominationPeriodDatesQuery = useNominationPeriodDatesQuery(DeployedModules.SPARTAN_COUNCIL); */
	const votingPeriodDatesQuery = useVotingPeriodDatesQuery(DeployedModules.SPARTAN_COUNCIL);
	const currentPeriodQuery = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);

	return (
		<SpotlightSection>
			{currentPeriodQuery.data?.currentPeriod === '1' && (
				<StyledBanner>{t('dashboard.banner.nominate')}</StyledBanner>
			)}
			<StyledDashboard>
				<StyledSNXStar>
					<StyledNumber>
						{new Date(votingPeriodDatesQuery.data?.votingPeriodStartDate ?? 0).toLocaleDateString()}
					</StyledNumber>
					<StyledStarHeadline>{t('dashboard.next-election')}</StyledStarHeadline>
					<StyledButtonsWrapper>
						<StyledRow>
							<StyledButton
								variant="gradient"
								secondaryBackgroundColor={theme.colors.backgroundColor}
								onClick={() => {}}
							>
								<StyledButtonHeadline>
									{t('dashboard.view-council-members')} <ArrowLinkOffIcon active={true} />
								</StyledButtonHeadline>
								<StyledButtonSubline>
									{t('dashboard.view-council-members-subline')}
								</StyledButtonSubline>
							</StyledButton>
							<StyledButton
								variant="gradient"
								secondaryBackgroundColor={theme.colors.backgroundColor}
								onClick={() => {}}
							>
								<StyledButtonHeadline>
									{t('dashboard.view-council-members')} <ArrowLinkOffIcon active={true} />
								</StyledButtonHeadline>
								<StyledButtonSubline>
									{t('dashboard.view-council-members-subline')}
								</StyledButtonSubline>
							</StyledButton>
						</StyledRow>
						<StyledRow>
							<StyledButton
								variant="gradient"
								secondaryBackgroundColor={theme.colors.backgroundColor}
								onClick={() => {}}
							>
								<StyledButtonHeadline>
									{t('dashboard.view-council-members')} <ArrowLinkOffIcon active={true} />
								</StyledButtonHeadline>
								<StyledButtonSubline>
									{t('dashboard.view-council-members-subline')}
								</StyledButtonSubline>
							</StyledButton>
							<StyledButton
								variant="gradient"
								secondaryBackgroundColor={theme.colors.backgroundColor}
								onClick={() => {}}
							>
								<StyledButtonHeadline>
									{t('dashboard.view-council-members')} <ArrowLinkOffIcon active={true} />
								</StyledButtonHeadline>
								<StyledButtonSubline>
									{t('dashboard.view-council-members-subline')}
								</StyledButtonSubline>
							</StyledButton>
						</StyledRow>
					</StyledButtonsWrapper>
				</StyledSNXStar>
				<Councils />
				{/* 			<div>Current EPOCH Index: {epochIndexQuery.data}</div>
				<StyledSubline>
					Current EPOCH Period: {currentPeriodQuery.data?.currentPeriod}
				</StyledSubline>
				<StyledSubline>
					Current EPOCH Start Date:{' '}
					{new Date(currentEpochDatesQuery.data?.epochStartDate ?? 0).toLocaleDateString()}
				</StyledSubline>
				<StyledSubline>
					Current EPOCH End Date:{' '}
					{new Date(currentEpochDatesQuery.data?.epochEndDate ?? 0).toLocaleDateString()}
				</StyledSubline>
				<StyledSubline>
					Nomination Start Date:{' '}
					{new Date(
						nominationPeriodDatesQuery.data?.nominationPeriodStartDate ?? 0
					).toLocaleDateString()}
				</StyledSubline>
				<StyledSubline>
					Voting Start Date:{' '}
					{new Date(votingPeriodDatesQuery.data?.votingPeriodStartDate ?? 0).toLocaleDateString()}
				</StyledSubline>
				<StyledSubline>Next EPOCH Seat Count: {nextEpochSeatCountQuery.data}</StyledSubline> */}
			</StyledDashboard>
		</SpotlightSection>
	);
}

const StyledDashboard = styled.section`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const SpotlightSection = styled(Spotlight)`
	max-width: 100%;
`;

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
`;

const StyledNumber = styled.span`
	font-family: 'GT America Mono';
	font-size: 2.33rem;
	color: ${({ theme }) => theme.colors.green};
`;

const StyledBanner = styled.div`
	background: ${({ theme }) => theme.colors.gradients.orange};
	width: 100%;
	font-family: 'GT America';
	font-size: 1.14rem;
	font-weight: 700;
	color: ${({ theme }) => theme.colors.black}; ;
`;

const StyledStarHeadline = styled.h1`
	font-family: 'GT America Extended';
	font-stretch: expanded;
	font-size: 3.66rem;
	text-align: center;
	margin: 0;
`;

const StyledButtonsWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
`;

const StyledRow = styled.div`
	display: flex;
	justify-content: space-around;
	width: 100%;
	margin-bottom: ${({ theme }) => theme.spacings.margin.medium};
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

const StyledButton = styled(Button)`
	max-width: 460px;
`;

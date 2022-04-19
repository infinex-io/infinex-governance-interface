import { Carousel } from '@synthetixio/ui';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { DeployedModules } from 'containers/Modules/Modules';

import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import useNextEpochSeatCountQuery from 'queries/epochs/useNextEpochSeatCountQuery';
import useCurrentEpochDatesQuery from 'queries/epochs/useCurrentEpochDatesQuery';
import useNominationPeriodDatesQuery from 'queries/epochs/useNominationPeriodDatesQuery';
import useVotingPeriodDatesQuery from 'queries/epochs/useVotingPeriodDatesQuery';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';

export default function Dashboard() {
	const { t } = useTranslation();

	const epochIndexQuery = useEpochIndexQuery(DeployedModules.SPARTAN_COUNCIL);
	const nextEpochSeatCountQuery = useNextEpochSeatCountQuery(DeployedModules.SPARTAN_COUNCIL);
	const currentEpochDatesQuery = useCurrentEpochDatesQuery(DeployedModules.SPARTAN_COUNCIL);
	const nominationPeriodDatesQuery = useNominationPeriodDatesQuery(DeployedModules.SPARTAN_COUNCIL);
	const votingPeriodDatesQuery = useVotingPeriodDatesQuery(DeployedModules.SPARTAN_COUNCIL);
	const currentPeriodQuery = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);

	return (
		<StyledDashboard>
			<StyledHeadline>{t('dashboard.headline')}</StyledHeadline>

			<StyledHeadline>Current EPOCH Index: {epochIndexQuery.data}</StyledHeadline>
			<StyledSubline>Current EPOCH Period: {currentPeriodQuery.data?.currentPeriod}</StyledSubline>
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
			<StyledSubline>Next EPOCH Seat Count: {nextEpochSeatCountQuery.data}</StyledSubline>

			<StyledSubline>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consectetur sit donec id etiam id
				morbi viverra.
			</StyledSubline>
			<Carousel carouselItems={carouselItems} maxWidth="100%"></Carousel>
		</StyledDashboard>
	);
}

const StyledDashboard = styled.section`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const StyledHeadline = styled.h1`
	font-family: 'Inter';
	font-style: normal;
	font-weight: 700;
	font-size: 40px;
`;

const StyledSubline = styled.p`
	font-size: 18px;
`;

const StyledCarouselItem = styled.div`
	min-width: 600px;
	height: 500px;
	display: flex;
	justify-content: center;
`;

const carouselItems = [
	<StyledCarouselItem>1</StyledCarouselItem>,
	<StyledCarouselItem>2</StyledCarouselItem>,
	<StyledCarouselItem>3</StyledCarouselItem>,
	<StyledCarouselItem>4</StyledCarouselItem>,
	<StyledCarouselItem>5</StyledCarouselItem>,
	<StyledCarouselItem>6</StyledCarouselItem>,
];

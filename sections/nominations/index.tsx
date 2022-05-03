import ElectedCouncil from 'components/ElectedCouncil';
import NominateSelfBanner from 'components/Banners/NominateSelfBanner';
import Election from './CurrentElections';
import styled from 'styled-components';
import { H3 } from 'components/Headlines/H3';
import { Flex } from '@synthetixio/ui';
import { useTranslation } from 'react-i18next';
import RemainingTime from 'components/RemainingTime';
import { DeployedModules } from 'containers/Modules/Modules';
import useNominationPeriodDatesQuery from 'queries/epochs/useNominationPeriodDatesQuery';
import { parseRemainingTime } from 'utils/time';
import LandingPage from 'components/LandingPage';
import useVotingPeriodDatesQuery from 'queries/epochs/useVotingPeriodDatesQuery';

export default function NominationsLandingPage() {
	const { t } = useTranslation();
	const { data: spartanNominationTime } = useNominationPeriodDatesQuery(
		DeployedModules.SPARTAN_COUNCIL
	);
	const { data: grantsNominationTime } = useNominationPeriodDatesQuery(
		DeployedModules.GRANTS_COUNCIL
	);
	const { data: ambassadorNominationTime } = useNominationPeriodDatesQuery(
		DeployedModules.AMBASSADOR_COUNCIL
	);
	const { data: treasuryNominationTime } = useNominationPeriodDatesQuery(
		DeployedModules.TREASURY_COUNCIL
	);

	const { data } = useVotingPeriodDatesQuery(DeployedModules.SPARTAN_COUNCIL);
	const remainingTime = data?.votingPeriodEndDate && parseRemainingTime(data.votingPeriodEndDate);

	return (
		<>
			<NominateSelfBanner hideButton />
			<LandingPage remainingTime={Number(remainingTime)} />
			<ElectedCouncil />
			<Flex wrap justifyContent="center">
				<StyledCountdownCard direction="column" alignItems="center">
					<H3>{t('landing-pages.nomination.sc-opens')}</H3>
					{spartanNominationTime?.nominationPeriodStartDate && (
						<RemainingTime glow>
							{parseRemainingTime(spartanNominationTime.nominationPeriodStartDate)}
						</RemainingTime>
					)}
				</StyledCountdownCard>
				<StyledCountdownCard direction="column" alignItems="center">
					<H3>{t('landing-pages.nomination.gd-opens')}</H3>
					{grantsNominationTime?.nominationPeriodStartDate && (
						<RemainingTime glow>
							{parseRemainingTime(grantsNominationTime.nominationPeriodStartDate)}
						</RemainingTime>
					)}
				</StyledCountdownCard>
				<StyledCountdownCard direction="column" alignItems="center">
					<H3>{t('landing-pages.nomination.ac-opens')}</H3>
					{ambassadorNominationTime?.nominationPeriodStartDate && (
						<RemainingTime glow>
							{parseRemainingTime(ambassadorNominationTime.nominationPeriodStartDate)}
						</RemainingTime>
					)}
				</StyledCountdownCard>
				<StyledCountdownCard direction="column" alignItems="center">
					<H3>{t('landing-pages.nomination.tc-opens')}</H3>
					{treasuryNominationTime?.nominationPeriodStartDate && (
						<RemainingTime glow>
							{parseRemainingTime(treasuryNominationTime.nominationPeriodStartDate)}
						</RemainingTime>
					)}
				</StyledCountdownCard>
			</Flex>
		</>
	);
}

const StyledCountdownCard = styled(Flex)`
	border: 2px solid ${({ theme }) => theme.colors.green};
	box-shadow: 0px 0px 15px ${({ theme }) => theme.colors.green};
	border-radius: 4px;
	padding: 10px 15px;
	margin: 20px;
	min-width: 262px;
	min-height: 90px;
`;

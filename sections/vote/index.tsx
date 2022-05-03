import { Button, Flex } from '@synthetixio/ui';
import ElectedCouncil from 'components/ElectedCouncil';
import LandingPage from 'components/LandingPage';
import VoteBanner from 'components/Banners/VoteBanner';
import { DeployedModules } from 'containers/Modules/Modules';
import useVotingPeriodDatesQuery from 'queries/epochs/useVotingPeriodDatesQuery';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { parseRemainingTime } from 'utils/time';

export default function VotingLandingPage() {
	const { t } = useTranslation();
	const { data } = useVotingPeriodDatesQuery(DeployedModules.SPARTAN_COUNCIL);
	const remainingTime = data?.votingPeriodEndDate && parseRemainingTime(data.votingPeriodEndDate);
	return (
		<>
			<VoteBanner />
			<LandingPage
				headline={t('landing-pages.voting.headline')}
				remainingTime={Number(remainingTime)}
			>
				<Flex justifyContent="center">
					<StyledButton
						text={t('landing-pages.voting.button')}
						variant="primary"
						onClick={() => {}}
						size="large"
					/>
				</Flex>
			</LandingPage>
			<ElectedCouncil />
		</>
	);
}

const StyledButton = styled(Button)`
	min-width: 280px;
`;

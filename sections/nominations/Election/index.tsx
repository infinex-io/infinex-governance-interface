import useVotingPeriodDatesQuery from 'queries/epochs/useVotingPeriodDatesQuery';
import { DeployedModules } from 'containers/Modules/Modules';
import { parseRemainingTime } from 'utils/time';
import LandingPage from 'components/LandingPage';

export default function Election() {
	const { data } = useVotingPeriodDatesQuery(DeployedModules.SPARTAN_COUNCIL);
	const remainingTime =
		data?.votingPeriodStartDate &&
		parseRemainingTime(new Date(data.votingPeriodStartDate).getTime());

	return <LandingPage remainingTime={Number(remainingTime)} />;
}

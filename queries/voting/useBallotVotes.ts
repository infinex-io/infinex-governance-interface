import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { hexStringBN } from 'utils/hexString';

function useBallotVotesQuery(
	moduleInstance: DeployedModules,
	ballotId: string,
	epochIndex?: string
) {
	const governanceModules = useModulesContext();

	return useQuery<number>(
		['ballotVotes', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let ballotVotes;
			if (epochIndex) {
				ballotVotes = Number(
					await contract?.getBallotVotesInEpoch(ballotId, hexStringBN(epochIndex))
				);
			} else {
				ballotVotes = Number(await contract?.getBallotVotes(ballotId));
			}
			return ballotVotes;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && ballotId !== null,
		}
	);
}

export default useBallotVotesQuery;

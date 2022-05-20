import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { hexStringBN } from 'utils/hexString';

function useBallotCandidatesQuery(
	moduleInstance: DeployedModules,
	ballotId: string,
	epochIndex?: string
) {
	const governanceModules = useModulesContext();

	return useQuery<string[]>(
		['ballotCandidates', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let ballotCandidates: string[];
			if (epochIndex) {
				ballotCandidates = await contract?.getBallotCandidatesInEpoch(
					ballotId,
					hexStringBN(epochIndex)
				);
			} else {
				ballotCandidates = await contract?.getBallotCandidates(ballotId);
			}
			return ballotCandidates;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && ballotId !== null,
		}
	);
}

export default useBallotCandidatesQuery;

import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { hexStringBN } from 'utils/hexString';

function useCandidateVotesQuery(
	moduleInstance: DeployedModules,
	candidate: string,
	epochIndex?: string
) {
	const governanceModules = useModulesContext();
	return useQuery<number>(
		['candidateVotes', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let candidateVotes: number;
			if (epochIndex) {
				candidateVotes = Number(
					await contract?.getCandidateVotesInEpoch(candidate, hexStringBN(epochIndex))
				);
			} else {
				candidateVotes = Number(await contract?.getCandidateVotes(candidate));
			}
			return candidateVotes;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && candidate !== null,
		}
	);
}

export default useCandidateVotesQuery;

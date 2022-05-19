import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

function useCandidateVotesQuery(moduleInstance: DeployedModules, candidate: string) {
	const governanceModules = useModulesContext();

	return useQuery<number>(
		['candidateVotes', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let candidateVotes = Number(await contract?.getCandidateVotes(candidate));
			return candidateVotes;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && candidate !== null,
		}
	);
}

export default useCandidateVotesQuery;

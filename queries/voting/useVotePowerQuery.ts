import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

function useVotePowerQuery(moduleInstance: DeployedModules, walletAddress: string) {
	const governanceModules = useModulesContext();

	return useQuery<number>(
		['votePower', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let votePower = Number(await contract?.getVotePower(walletAddress));
			return votePower;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && walletAddress !== null,
		}
	);
}

export default useVotePowerQuery;

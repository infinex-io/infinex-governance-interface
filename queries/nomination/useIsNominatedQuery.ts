import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

function useIsNominated(moduleInstance: DeployedModules, walletAddress: string) {
	const governanceModules = useModulesContext();

	return useQuery<boolean>(
		['isNominated', moduleInstance, walletAddress],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let isNominated = await contract?.isNominated(walletAddress);
			return isNominated;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && walletAddress !== null,
			cacheTime: 60 * 60 * 15,
		}
	);
}

export default useIsNominated;

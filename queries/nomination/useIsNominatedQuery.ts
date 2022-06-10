import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { hexStringBN } from 'utils/hexString';
import { isNominatedQueryKeys } from 'utils/queries';

function useIsNominated(
	moduleInstance: DeployedModules,
	walletAddress: string,
	epochIndex?: string
) {
	const governanceModules = useModulesContext();
	return useQuery<boolean>(
		isNominatedQueryKeys(moduleInstance, walletAddress),
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let isNominated: boolean;
			if (epochIndex) {
				isNominated = await contract?.wasNominated(walletAddress, hexStringBN(epochIndex));
			} else {
				isNominated = await contract?.isNominated(walletAddress);
			}
			return isNominated;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null && walletAddress !== null,
			staleTime: 900000,
		}
	);
}

export default useIsNominated;

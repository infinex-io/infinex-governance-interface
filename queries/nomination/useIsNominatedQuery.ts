import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { ethers } from 'ethers';
import { hexStringBN } from 'utils/hexString';

function useIsNominated(
	moduleInstance: DeployedModules,
	walletAddress: string,
	epochIndex?: string
) {
	const governanceModules = useModulesContext();
	return useQuery<boolean>(
		['isNominated', moduleInstance, walletAddress, epochIndex],
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
			cacheTime: 60 * 60 * 15,
		}
	);
}

export default useIsNominated;

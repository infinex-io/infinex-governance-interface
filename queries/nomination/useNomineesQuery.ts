import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { hexStringBN } from 'utils/hexString';

function useNomineesQuery(moduleInstance: DeployedModules, epochIndex?: string) {
	const governanceModules = useModulesContext();

	return useQuery<string[]>(
		['nominees', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let nominees;
			if (epochIndex) {
				nominees = await contract?.getNomineesAtEpoch(hexStringBN(epochIndex));
			} else {
				nominees = await contract?.getNominees();
			}
			return nominees;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
			staleTime: 900000,
		}
	);
}

export default useNomineesQuery;

import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { hexStringBN } from 'utils/hexString';

function useNomineesQuery(moduleInstance: DeployedModules) {
	const governanceModules = useModulesContext();

	return useQuery<string[]>(
		['nominees', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let nominees;
			// nominees = await contract?.getNomineesAtEpoch(hexStringBN(epochIndex));
			nominees = await contract?.getNominees();
			return nominees;
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
			staleTime: 900000,
		}
	);
}

export default useNomineesQuery;

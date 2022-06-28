import { DeployedModules, useModulesContext } from 'containers/Modules';
import { useQuery } from 'react-query';
import { hexStringBN } from 'utils/hexString';

export default function useNextEpochDatesQuery(moduleInstance: DeployedModules) {
	const governanceModules = useModulesContext();
	return useQuery(
		['useNextEpochDatesQuery', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			const epochIndex = Number(await contract?.getEpochIndex());
			const epochStartDate =
				Number(await contract?.getEpochStartDateForIndex(hexStringBN(epochIndex + 1))) * 1000;
			const epochEndDate =
				Number(await contract?.getEpochEndDateForIndex(hexStringBN(epochIndex + 1))) * 1000;
			return { epochStartDate, epochEndDate };
		},
		{
			enabled: !!moduleInstance,
		}
	);
}

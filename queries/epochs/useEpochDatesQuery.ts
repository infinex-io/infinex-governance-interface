import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { hexStringBN } from 'utils/hexString';

export type EpochDates = {
	epochStartDate: number;
	epochEndDate: number;
};

function useEpochDatesQuery(moduleInstance: DeployedModules, epochIndex: string | number) {
	const governanceModules = useModulesContext();

	return useQuery<EpochDates>(
		['epochDates', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			const epochStartDate =
				Number(await contract?.getEpochStartDateForIndex(hexStringBN(epochIndex))) * 1000;
			const epochEndDate =
				Number(await contract?.getEpochEndDateForIndex(hexStringBN(epochIndex))) * 1000;
			return { epochStartDate, epochEndDate };
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
			staleTime: 900000,
		}
	);
}

export default useEpochDatesQuery;

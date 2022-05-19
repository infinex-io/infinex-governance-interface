import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

type EpochDates = {
	epochStartDate: number;
	epochEndDate: number;
};

function useCurrentEpochDatesQuery(moduleInstance: DeployedModules) {
	const governanceModules = useModulesContext();

	return useQuery<EpochDates>(
		['currentEpochDates', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			const epochStartDate = Number(await contract?.getEpochStartDate()) * 1000;
			const epochEndDate = Number(await contract?.getEpochEndDate()) * 1000;
			return { epochStartDate, epochEndDate };
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useCurrentEpochDatesQuery;

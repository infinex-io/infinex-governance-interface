import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { hexStringBN } from 'utils/hexString';

type EpochDates = {
	epochStartDate: number;
	epochEndDate: number;
};

function useEpochDatesQuery(moduleInstance: DeployedModules, epochIndex?: string) {
	const governanceModules = useModulesContext();

	return useQuery<EpochDates>(
		['epochDates', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let epochStartDate;
			let epochEndDate;
			if (epochIndex) {
				epochStartDate =
					Number(await contract?.getEpochStartDateForIndex(hexStringBN(epochIndex))) * 1000;
				epochEndDate =
					Number(await contract?.getEpochEndDateForIndex(hexStringBN(epochIndex))) * 1000;
			} else {
				epochStartDate = Number(await contract?.getEpochStartDate()) * 1000;
				epochEndDate = Number(await contract?.getEpochEndDate()) * 1000;
			}
			return { epochStartDate, epochEndDate };
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
			staleTime: 900000,
		}
	);
}

export default useEpochDatesQuery;

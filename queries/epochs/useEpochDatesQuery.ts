import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { ethers } from 'ethers';

type EpochDates = {
	epochStartDate: number;
	epochEndDate: number;
};

function useEpochDatesQuery(moduleInstance: DeployedModules, epochIndex?: string) {
	const governanceModules = useModulesContext();

	return useQuery<EpochDates>(
		['epochDates', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let epochStartDate;
			let epochEndDate;
			if (epochIndex) {
				epochStartDate =
					Number(
						await contract?.getEpochStartDateForIndex(
							ethers.BigNumber.from(epochIndex).toHexString()
						)
					) * 1000;
				epochEndDate =
					Number(
						await contract?.getEpochEndDateForIndex(ethers.BigNumber.from(epochIndex).toHexString())
					) * 1000;
			} else {
				epochStartDate = Number(await contract?.getEpochStartDate()) * 1000;
				epochEndDate = Number(await contract?.getEpochEndDate()) * 1000;
			}
			return { epochStartDate, epochEndDate };
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useEpochDatesQuery;

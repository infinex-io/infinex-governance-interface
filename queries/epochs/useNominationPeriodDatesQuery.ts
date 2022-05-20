import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { hexStringBN } from 'utils/hexString';

type NominationPeriodDates = {
	nominationPeriodStartDate: number;
	nominationPeriodEndDate: number;
};

function useNominationPeriodDatesQuery(moduleInstance: DeployedModules, epochIndex?: string) {
	const governanceModules = useModulesContext();

	return useQuery<NominationPeriodDates>(
		['nominationPeriodDates', moduleInstance, epochIndex],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let nominationPeriodStartDate;
			let nominationPeriodEndDate;
			if (epochIndex) {
				nominationPeriodStartDate =
					Number(await contract?.getNominationPeriodStartDateForIndex(hexStringBN(epochIndex))) *
					1000;
				nominationPeriodEndDate =
					Number(await contract?.getVotingPeriodStartDateForIndex(hexStringBN(epochIndex))) * 1000;
			} else {
				nominationPeriodStartDate = Number(await contract?.getNominationPeriodStartDate()) * 1000;
				nominationPeriodEndDate = Number(await contract?.getVotingPeriodStartDate()) * 1000;
			}

			return { nominationPeriodStartDate, nominationPeriodEndDate };
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useNominationPeriodDatesQuery;

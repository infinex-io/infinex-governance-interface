import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

type NominationPeriodDates = {
	nominationPeriodStartDate: number;
};

function useNominationPeriodDatesQuery(moduleInstance: DeployedModules) {
	const { governanceModules } = Modules.useContainer();

	return useQuery<NominationPeriodDates>(
		['nominationPeriodDates', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			const nominationPeriodStartDate =
				Number(await contract?.getNominationPeriodStartDate()) * 1000;
			return { nominationPeriodStartDate };
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useNominationPeriodDatesQuery;

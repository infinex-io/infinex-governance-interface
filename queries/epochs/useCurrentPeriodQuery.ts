import { useQuery } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

enum EpochPeriods {
	ADMINISTRATION = 0,
	NOMINATION = 1,
	VOTING = 2,
	EVALUATION = 3,
}

type CurrentPeriod = {
	currentPeriod: number;
};

function useCurrentPeriod(moduleInstance: DeployedModules) {
	const { governanceModules } = Modules.useContainer();

	return useQuery<CurrentPeriod>(
		['currentPeriod', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let currentPeriod = Number(await contract?.getCurrentPeriod());
			return { currentPeriod: Number(EpochPeriods[currentPeriod]) };
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
		}
	);
}

export default useCurrentPeriod;

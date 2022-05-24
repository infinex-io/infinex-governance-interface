import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

export enum EpochPeriods {
	ADMINISTRATION = 0,
	NOMINATION = 1,
	VOTING = 2,
	EVALUATION = 3,
}

type CurrentPeriod = {
	currentPeriod: keyof typeof EpochPeriods;
};

function useCurrentPeriod(moduleInstance: DeployedModules) {
	const governanceModules = useModulesContext();

	return useQuery<CurrentPeriod>(
		['currentPeriod', moduleInstance],
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;
			let currentPeriod = Number(await contract?.getCurrentPeriod());

			return { currentPeriod: EpochPeriods[currentPeriod] as keyof typeof EpochPeriods };
		},
		{
			enabled: governanceModules !== null && moduleInstance !== null,
			staleTime: 900000,
		}
	);
}

export default useCurrentPeriod;

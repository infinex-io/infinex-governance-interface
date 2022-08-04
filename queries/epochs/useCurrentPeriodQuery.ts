import { useQuery, useQueries } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { CouncilsDictionaryType, COUNCILS_DICTIONARY } from 'constants/config';
import { Contract } from 'ethers';

export enum EpochPeriods {
	ADMINISTRATION = 0,
	NOMINATION = 1,
	VOTING = 2,
	EVALUATION = 3,
}

export type CurrentPeriod = {
	council: string | undefined;
	currentPeriod: keyof typeof EpochPeriods;
};

export type CurrentPeriodsWithCouncils = Record<
	CouncilsDictionaryType['slug'],
	keyof typeof EpochPeriods
>;

const getCurrentPeriodQueryKey = (moduleInstance: DeployedModules) => [
	'currentPeriod',
	moduleInstance,
];
const fetchCurrentPeriod = async (
	councilContract: Contract | undefined,
	moduleInstance: DeployedModules
) => {
	const currentPeriod = Number(await councilContract?.getCurrentPeriod());
	const councilData = COUNCILS_DICTIONARY.find((council) => council.module === moduleInstance);
	return {
		council: councilData?.slug,
		currentPeriod: EpochPeriods[currentPeriod] as keyof typeof EpochPeriods,
	};
};

export const useCurrentPeriod = (moduleInstance: DeployedModules) => {
	const governanceModules = useModulesContext();
	return useQuery<CurrentPeriod>(
		getCurrentPeriodQueryKey(moduleInstance),
		() => fetchCurrentPeriod(governanceModules[moduleInstance]?.contract, moduleInstance),
		{
			enabled: governanceModules !== null,
			staleTime: 900000,
		}
	);
};
export const useCurrentPeriods = () => {
	const governanceModules = useModulesContext();
	return useQueries(
		COUNCILS_DICTIONARY.map((council) => ({
			queryKey: getCurrentPeriodQueryKey(council.module),
			queryFn: () =>
				fetchCurrentPeriod(governanceModules[council.module]?.contract, council.module),
			staleTime: 60000,
		}))
	);
};

import { DeployedModules } from 'containers/Modules';
import { BigNumber } from 'ethers';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import { useMemo } from 'react';
import { useVotingResult } from './useVotingResult';

export const useVotingCount = (moduleInstance: DeployedModules) => {
	const epochIndex = useEpochIndexQuery(moduleInstance);
	const { data, isLoading } = useVotingResult(moduleInstance, epochIndex.data);

	return useMemo(() => {
		if (!data || isLoading) return '';
		return data.reduce((cur, prev) => cur.add(prev.voteCount), BigNumber.from(0)).toString();
	}, [data, isLoading]);
};

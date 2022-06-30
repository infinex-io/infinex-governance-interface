import { DeployedModules } from 'containers/Modules';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { useVotingResult } from './useVotingResult';

export const useVotingCount = (moduleInstance: DeployedModules, epochIndex: string | null) => {
	const { data, isLoading } = useVotingResult(moduleInstance, epochIndex);

	return useMemo(() => {
		if (!data || isLoading) return '';
		return data.reduce((cur, prev) => cur.add(prev.voteCount), BigNumber.from(0)).toString();
	}, [data, isLoading]);
};

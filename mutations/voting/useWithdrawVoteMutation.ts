import { useMutation, useQueryClient } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { useTransactionModalContext } from '@synthetixio/ui';

function useWithdrawVoteMutation(moduleInstance: DeployedModules) {
	const governanceModules = useModulesContext();
	const { setState } = useTransactionModalContext();

	return useMutation('withdrawVote', async () => {
		const contract = governanceModules[moduleInstance]?.contract;

		try {
			const gasLimit = await contract?.estimateGas.withdrawVote();
			let tx = await contract?.withdrawVote({ gasLimit });
			return tx;
		} catch (error) {
			setState('error');
			console.error(error);
			return new Error();
		}
	});
}

export default useWithdrawVoteMutation;

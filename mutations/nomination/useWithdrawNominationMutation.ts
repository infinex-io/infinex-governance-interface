import { useMutation, useQueryClient } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { useTransactionModalContext } from '@synthetixio/ui';

function useWithdrawNominationMutation(moduleInstance: DeployedModules) {
	const queryClient = useQueryClient();
	const governanceModules = useModulesContext();
	const { setState } = useTransactionModalContext();

	return useMutation(
		'withdrawNomination',
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;

			if (contract) {
				const gasLimit = await contract.estimateGas.withdrawNomination();
				let tx = await contract.withdrawNomination({ gasLimit });
				return tx;
			} else {
				setState('error');
				return new Error();
			}
		},
		{
			onSuccess: async () => {
				await queryClient.resetQueries({
					active: true,
				});
			},
		}
	);
}

export default useWithdrawNominationMutation;

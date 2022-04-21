import { useMutation, useQueryClient } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

function useWithdrawNominationMutation(moduleInstance: DeployedModules) {
	const queryClient = useQueryClient();
	const { governanceModules } = Modules.useContainer();

	return useMutation(
		'withdrawNomination',
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;

			if (contract) {
				const gasLimit = await contract.estimateGas.withdrawNomination();
				let tx = await contract.withdrawNomination({ gasLimit });
				const receipt = tx.wait();
				return receipt;
			} else {
				return new Error();
			}
		},
		{
			onSuccess: async () => {
				queryClient.refetchQueries();
			},
		}
	);
}

export default useWithdrawNominationMutation;

import { useMutation, useQueryClient } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

function useWithdrawNominationMutation(moduleInstance: DeployedModules) {
	const queryClient = useQueryClient();
	const governanceModules = useModulesContext();

	return useMutation(
		'withdrawNomination',
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;

			if (contract) {
				const gasLimit = await contract.estimateGas.withdrawNomination();
				let tx = await contract.withdrawNomination({ gasLimit });
				return tx;
			} else {
				return new Error();
			}
		},
		{
			onSuccess: async () => {
				await queryClient.refetchQueries({
					active: true,
					queryKey: ['nominees', moduleInstance, null],
				});
			},
		}
	);
}

export default useWithdrawNominationMutation;

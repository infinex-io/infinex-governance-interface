import { useMutation, useQueryClient } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';

type Address = string;

function useCastMutation(moduleInstance: DeployedModules) {
	const queryClient = useQueryClient();
	const governanceModules = useModulesContext();

	return useMutation(
		'cast',
		async (addresses: Address[]) => {
			const contract = governanceModules[moduleInstance]?.contract;

			if (contract) {
				const gasLimit = await contract.estimateGas.cast(addresses);
				let tx = await contract.cast(addresses, { gasLimit });
				const receipt = tx.wait();
				return receipt;
			} else {
				return new Error();
			}
		},
		{
			onSuccess: async () => {
				await queryClient.refetchQueries();
			},
		}
	);
}

export default useCastMutation;

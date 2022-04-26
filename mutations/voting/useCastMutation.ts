import { useMutation, useQueryClient } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

type Address = string;

function useCastMutation(moduleInstance: DeployedModules) {
	const queryClient = useQueryClient();
	const { governanceModules } = Modules.useContainer();

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
				queryClient.refetchQueries();
			},
		}
	);
}

export default useCastMutation;

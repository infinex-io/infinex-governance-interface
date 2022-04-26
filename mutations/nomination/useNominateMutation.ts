import { useMutation, useQueryClient } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

function useNominateMutation(moduleInstance: DeployedModules) {
	const queryClient = useQueryClient();
	const { governanceModules } = Modules.useContainer();

	return useMutation(
		'nominate',
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;

			if (contract) {
				const gasLimit = await contract.estimateGas.nominate();
				let tx = await contract.nominate({ gasLimit });
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

export default useNominateMutation;

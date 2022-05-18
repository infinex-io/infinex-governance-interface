import { useMutation, useQueryClient } from 'react-query';
import Modules from 'containers/Modules';
import { DeployedModules } from 'containers/Modules/Modules';

type Address = string;

function useWithdrawVoteMutation(moduleInstance: DeployedModules) {
	const queryClient = useQueryClient();
	const { governanceModules } = Modules.useContainer();

	return useMutation(
		'withdrawVote',
		async (addresses: Address[]) => {
			const contract = governanceModules[moduleInstance]?.contract;

			if (contract) {
				const gasLimit = await contract.estimateGas.withdrawVote();
				let tx = await contract.withdrawVote({ gasLimit });
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

export default useWithdrawVoteMutation;

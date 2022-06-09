import { useMutation, useQueryClient } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { useTransactionModalContext } from '@synthetixio/ui';
import { BigNumber } from 'ethers';

function useNominateMutation(moduleInstance: DeployedModules) {
	const queryClient = useQueryClient();
	const governanceModules = useModulesContext();
	const { setState } = useTransactionModalContext();
	return useMutation(
		'nominate',
		async () => {
			const contract = governanceModules[moduleInstance]?.contract;

			if (contract) {
				// TODO @MF fix when release
				const gasLimit = await contract.estimateGas.nominate();
				let tx = await contract.nominate({
					gasLimit,
					gasPrice: BigNumber.from(0),
				});
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

export default useNominateMutation;

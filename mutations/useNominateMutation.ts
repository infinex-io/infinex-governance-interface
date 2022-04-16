import { ethers } from 'ethers';
import { useMutation, useQueryClient } from 'react-query';
import { ElectionModuleAddress } from '../constants/addresses';
import ElectionModuleABI from 'contracts/ElectionModule.json';

function useNominateMutation(signer: ethers.providers.JsonRpcSigner) {
	const queryClient = useQueryClient();
	return useMutation(
		'nominate',
		async () => {
			const contract = new ethers.Contract(ElectionModuleAddress, ElectionModuleABI.abi, signer);
			let tx;
			try {
				tx = await contract.nominate();
			} catch (error) {
				console.log(error);
			}
			return tx;
		},
		{
			onSuccess: async () => {
				queryClient.refetchQueries();
			},
		}
	);
}

export default useNominateMutation;

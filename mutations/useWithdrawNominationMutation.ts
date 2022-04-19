import { ethers } from 'ethers';
import { useMutation } from 'react-query';
import { ElectionModuleAddress } from '../constants/addresses';
import ElectionModuleABI from 'contracts/ElectionModule.json';

function useWithdrawNominationMutation(signer: ethers.providers.JsonRpcSigner) {
	return useMutation('withdrawNomination', async () => {
		const contract = new ethers.Contract(ElectionModuleAddress, ElectionModuleABI.abi, signer);
		let tx;
		try {
			tx = await contract.withdrawNomination();
		} catch (error) {
			console.log(error);
		}
		return tx;
	});
}

export default useWithdrawNominationMutation;

import { ethers } from 'ethers';
import { useMutation } from 'react-query';
import { ElectionModuleAddress } from '../constants/addresses';
import ElectionModuleABI from 'contracts/ElectionModule.json';

type Address = string;

function useCastMutation(signer: ethers.providers.JsonRpcSigner) {
	return useMutation('cast', async (addresses: Address[]) => {
		const contract = new ethers.Contract(ElectionModuleAddress, ElectionModuleABI.abi, signer);
		let tx;
		try {
			tx = await contract.cast(addresses);
		} catch (error) {
			console.log(error);
		}
		return tx;
	});
}

export default useCastMutation;

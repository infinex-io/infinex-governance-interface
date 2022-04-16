import { ethers } from 'ethers';
import { useQuery } from 'react-query';
import { ElectionModuleAddress } from '../constants/addresses';
import ElectionModuleABI from 'contracts/ElectionModule.json';

function useEpochIndexQuery(provider: ethers.providers.JsonRpcProvider) {
	return useQuery<number>('epochIndex', async () => {
		// @TODO make contract fetching dynamic for different council/addresses
		const contract = new ethers.Contract(ElectionModuleAddress, ElectionModuleABI.abi, provider);
		let epochIndex = Number(await contract.getEpochIndex());
		return epochIndex;
	});
}

export default useEpochIndexQuery;

import { ethers } from 'ethers';
import { useQuery } from 'react-query';
import { ElectionModuleAddress } from '../constants/addresses';
import ElectionModuleABI from 'contracts/ElectionModule.json';

function useNextEpochSeatCountQuery(provider: ethers.providers.JsonRpcProvider) {
	return useQuery<number>('nextEpochSeatCount', async () => {
		// @TODO make contract fetching dynamic for different council/addresses
		const contract = new ethers.Contract(ElectionModuleAddress, ElectionModuleABI.abi, provider);
		let nextEpochSeatCount = Number(await contract.getNextEpochSeatCount());
		return nextEpochSeatCount;
	});
}

export default useNextEpochSeatCountQuery;

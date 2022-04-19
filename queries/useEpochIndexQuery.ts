import { useQuery } from 'react-query';
import Modules from 'containers/Modules/Modules';

function useEpochIndexQuery() {
	const { contracts } = Modules.useContainer();
	return useQuery<number>('epochIndex', async () => {
		// @TODO make contract fetching dynamic for different council/addresses
		const contract = contracts[0];
		let epochIndex = Number(await contract.getEpochIndex());
		return epochIndex;
	});
}

export default useEpochIndexQuery;

import { ethers } from 'ethers';
import { createContainer } from 'unstated-next';

import ElectionModuleABI from 'contracts/ElectionModule.json';
import { ElectionModuleAddress } from 'constants/addresses';
import Connector from 'containers/Connector';

const useModules = () => {
	const { chainId, provider, signer } = Connector.useContainer();
	let contracts: ethers.Contract[] = [];

	if (chainId && provider) {
		const SpartanCouncilModule = new ethers.Contract(
			ElectionModuleAddress,
			ElectionModuleABI.abi,
			signer ?? provider
		);

		contracts.push(SpartanCouncilModule);

		// const AmbassadorCouncilModule = new ethers.Contract(
		// 	ElectionModuleAddress,
		// 	ElectionModuleABI.abi,
		// signer ?? provider
		// );

		// contracts.push(AmbassadorCouncilModule);

		// const GrantsCouncilModule = new ethers.Contract(
		// 	ElectionModuleAddress,
		// 	ElectionModuleABI.abi,
		// signer ?? provider
		// );

		// contracts.push(GrantsCouncilModule);

		// const TreasuryCouncilModule = new ethers.Contract(
		// 	ElectionModuleAddress,
		// 	ElectionModuleABI.abi,
		// signer ?? provider
		// );

		// contracts.push(TreasuryCouncilModule);
	}

	return { contracts };
};

const Modules = createContainer(useModules);

export default Modules;

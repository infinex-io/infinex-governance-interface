import { ethers } from 'ethers';
import { createContainer } from 'unstated-next';

import ElectionModuleABI from 'contracts/ElectionModule.json';
import { ElectionModuleAddress } from 'constants/addresses';
import Connector from 'containers/Connector';

export enum DeployedModules {
	SPARTAN_COUNCIL = 'spartan council',
	AMBASSADOR_COUNCIL = 'ambassador council',
	GRANTS_COUNCIL = 'grants council',
	TREASURY_COUNCIL = 'treasury council',
}
export type GovernanceModule = {
	address: string;
	contract: ethers.Contract;
};

const useModules = () => {
	const { chainId, provider, signer } = Connector.useContainer();

	let governanceModules: Partial<Record<DeployedModules, GovernanceModule>> = {};

	if (chainId && provider) {
		const SpartanCouncilModule = new ethers.Contract(
			ElectionModuleAddress,
			ElectionModuleABI.abi,
			signer ?? provider
		);

		governanceModules[DeployedModules.SPARTAN_COUNCIL] = {
			address: ElectionModuleAddress,
			contract: SpartanCouncilModule,
		};

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

	return { governanceModules };
};

const Modules = createContainer(useModules);

export default Modules;

import { ethers } from 'ethers';
import { createContainer } from 'unstated-next';

import ElectionModuleABI from 'contracts/ElectionModule.json';
import Connector from 'containers/Connector';
import {
	ambassadorCouncil,
	grantsCouncil,
	spartanCouncil,
	treasuryCouncil,
} from 'constants/addresses';

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
			spartanCouncil,
			ElectionModuleABI.abi,
			signer ?? provider
		);

		governanceModules[DeployedModules.SPARTAN_COUNCIL] = {
			address: spartanCouncil,
			contract: SpartanCouncilModule,
		};

		const AmbassadorCouncilModule = new ethers.Contract(
			ambassadorCouncil,
			ElectionModuleABI.abi,
			signer ?? provider
		);

		governanceModules[DeployedModules.AMBASSADOR_COUNCIL] = {
			address: ambassadorCouncil,
			contract: AmbassadorCouncilModule,
		};

		const GrantsCouncilModule = new ethers.Contract(
			grantsCouncil,
			ElectionModuleABI.abi,
			signer ?? provider
		);

		governanceModules[DeployedModules.GRANTS_COUNCIL] = {
			address: grantsCouncil,
			contract: GrantsCouncilModule,
		};

		const TreasuryCouncilModule = new ethers.Contract(
			treasuryCouncil,
			ElectionModuleABI.abi,
			signer ?? provider
		);

		governanceModules[DeployedModules.TREASURY_COUNCIL] = {
			address: treasuryCouncil,
			contract: TreasuryCouncilModule,
		};
	}

	return { governanceModules };
};

const Modules = createContainer(useModules);

export default Modules;

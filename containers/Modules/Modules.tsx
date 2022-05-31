import { ethers } from 'ethers';
import ElectionModuleABI from 'contracts/ElectionModule.json';
import { useConnectorContext } from 'containers/Connector';
import {
	ambassadorCouncil,
	grantsCouncil,
	spartanCouncil,
	treasuryCouncil,
} from 'constants/addresses';
import { createContext, useContext, useEffect, useState, FC } from 'react';
import { chain } from 'wagmi';

export enum DeployedModules {
	SPARTAN_COUNCIL = 'spartan council',
	AMBASSADOR_COUNCIL = 'ambassador council',
	GRANTS_COUNCIL = 'grants council',
	TREASURY_COUNCIL = 'treasury council',
}
type GovernanceModule = Partial<
	Record<DeployedModules, { address: string; contract: ethers.Contract }>
>;

type ModulesContextType = GovernanceModule;

const ModulesContext = createContext<ModulesContextType | null>(null);

export const useModulesContext = () => {
	return useContext(ModulesContext) as ModulesContextType;
};

export const ModulesProvider: FC = ({ children }) => {
	const { chains, provider, L2DefaultProvider } = useConnectorContext();
	const [governanceModules, setGovernanceModules] = useState<GovernanceModule | null>(null);

	useEffect(() => {
		console.log(spartanCouncil);
		if (provider(chains[0].id)) {
			const SpartanCouncilModule = new ethers.Contract(
				spartanCouncil,
				ElectionModuleABI.abi,
				provider({ chainId: chain.optimism.id })
			);

			let modules = {} as GovernanceModule;

			modules[DeployedModules.SPARTAN_COUNCIL] = {
				address: spartanCouncil,
				contract: SpartanCouncilModule,
			};

			const AmbassadorCouncilModule = new ethers.Contract(
				ambassadorCouncil,
				ElectionModuleABI.abi,
				provider({ chainId: chain.optimism.id })
			);

			modules[DeployedModules.AMBASSADOR_COUNCIL] = {
				address: ambassadorCouncil,
				contract: AmbassadorCouncilModule,
			};

			const GrantsCouncilModule = new ethers.Contract(
				grantsCouncil,
				ElectionModuleABI.abi,
				provider({ chainId: chain.optimism.id })
			);

			modules[DeployedModules.GRANTS_COUNCIL] = {
				address: grantsCouncil,
				contract: GrantsCouncilModule,
			};

			const TreasuryCouncilModule = new ethers.Contract(
				treasuryCouncil,
				ElectionModuleABI.abi,
				provider({ chainId: chain.optimism.id })
			);

			modules[DeployedModules.TREASURY_COUNCIL] = {
				address: treasuryCouncil,
				contract: TreasuryCouncilModule,
			};

			setGovernanceModules(modules);
		}
	}, [chains, provider, L2DefaultProvider]);

	return <ModulesContext.Provider value={governanceModules}>{children}</ModulesContext.Provider>;
};

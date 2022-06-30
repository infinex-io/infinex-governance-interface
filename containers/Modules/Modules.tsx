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
import { useSigner } from 'wagmi';

export enum DeployedModules {
	SPARTAN_COUNCIL = 'spartan council',
	AMBASSADOR_COUNCIL = 'ambassador council',
	GRANTS_COUNCIL = 'grants council',
	TREASURY_COUNCIL = 'treasury council',
}

export const moduleAddresses = {
	[DeployedModules.SPARTAN_COUNCIL]: spartanCouncil,
	[DeployedModules.AMBASSADOR_COUNCIL]: ambassadorCouncil,
	[DeployedModules.GRANTS_COUNCIL]: grantsCouncil,
	[DeployedModules.TREASURY_COUNCIL]: treasuryCouncil,
};

type GovernanceModule = Partial<
	Record<DeployedModules, { address: string; contract: ethers.Contract }>
>;

type ModulesContextType = GovernanceModule;

const ModulesContext = createContext<ModulesContextType | null>(null);

export const useModulesContext = () => {
	return useContext(ModulesContext) as ModulesContextType;
};

export const ModulesProvider: FC = ({ children }) => {
	const { L2DefaultProvider } = useConnectorContext();
	const [governanceModules, setGovernanceModules] = useState<GovernanceModule | null>(null);
	const { data: signer } = useSigner();

	useEffect(() => {
		// TODO @MF fix it
		if (signer) {
			const SpartanCouncilModule = new ethers.Contract(
				spartanCouncil,
				ElectionModuleABI.abi,
				!!signer ? signer : L2DefaultProvider
			);
			let modules = {} as GovernanceModule;

			modules[DeployedModules.SPARTAN_COUNCIL] = {
				address: spartanCouncil,
				contract: SpartanCouncilModule,
			};

			const AmbassadorCouncilModule = new ethers.Contract(
				ambassadorCouncil,
				ElectionModuleABI.abi,
				!!signer ? signer : L2DefaultProvider
			);

			modules[DeployedModules.AMBASSADOR_COUNCIL] = {
				address: ambassadorCouncil,
				contract: AmbassadorCouncilModule,
			};

			const GrantsCouncilModule = new ethers.Contract(
				grantsCouncil,
				ElectionModuleABI.abi,
				!!signer ? signer : L2DefaultProvider
			);

			modules[DeployedModules.GRANTS_COUNCIL] = {
				address: grantsCouncil,
				contract: GrantsCouncilModule,
			};

			const TreasuryCouncilModule = new ethers.Contract(
				treasuryCouncil,
				ElectionModuleABI.abi,
				!!signer ? signer : L2DefaultProvider
			);

			modules[DeployedModules.TREASURY_COUNCIL] = {
				address: treasuryCouncil,
				contract: TreasuryCouncilModule,
			};
			setGovernanceModules(modules);
		}
	}, [signer, L2DefaultProvider]);

	return <ModulesContext.Provider value={governanceModules}>{children}</ModulesContext.Provider>;
};

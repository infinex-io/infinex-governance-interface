import { ethers } from 'ethers';
import ElectionModuleABI from 'contracts/ElectionModule.json';
import { useConnectorContext } from 'containers/Connector';
import {
	ambassadorCouncil,
	grantsCouncil,
	spartanCouncil,
	treasuryCouncil,
} from 'constants/addresses';
import {
	createContext,
	useContext,
	useEffect,
	useState,
	FC,
	FunctionComponent,
	PropsWithChildren,
} from 'react';
import { DeployedModules } from 'constants/config';

export { DeployedModules };

type GovernanceModule = Partial<
	Record<DeployedModules, { address: string; contract: ethers.Contract }>
>;

type ModulesContextType = GovernanceModule;

const ModulesContext = createContext<ModulesContextType | null>(null);

export const useModulesContext = () => {
	return useContext(ModulesContext) as ModulesContextType;
};

export const ModulesProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const { L2DefaultProvider, signer, network } = useConnectorContext();
	const [governanceModules, setGovernanceModules] = useState<GovernanceModule | null>(null);

	useEffect(() => {
		const wrongNetwork = network?.id !== 10;

		// Uncomment next line for testing forks
		if (!signer) return;

		const provider = !!signer && !wrongNetwork ? signer : L2DefaultProvider;

		const SpartanCouncilModule = new ethers.Contract(
			spartanCouncil,
			ElectionModuleABI.abi,
			provider
		);

		const modules = {} as GovernanceModule;

		modules[DeployedModules.SPARTAN_COUNCIL] = {
			address: spartanCouncil,
			contract: SpartanCouncilModule,
		};

		const AmbassadorCouncilModule = new ethers.Contract(
			ambassadorCouncil,
			ElectionModuleABI.abi,
			provider
		);

		modules[DeployedModules.AMBASSADOR_COUNCIL] = {
			address: ambassadorCouncil,
			contract: AmbassadorCouncilModule,
		};

		const GrantsCouncilModule = new ethers.Contract(grantsCouncil, ElectionModuleABI.abi, provider);

		modules[DeployedModules.GRANTS_COUNCIL] = {
			address: grantsCouncil,
			contract: GrantsCouncilModule,
		};

		const TreasuryCouncilModule = new ethers.Contract(
			treasuryCouncil,
			ElectionModuleABI.abi,
			provider
		);

		modules[DeployedModules.TREASURY_COUNCIL] = {
			address: treasuryCouncil,
			contract: TreasuryCouncilModule,
		};
		setGovernanceModules(modules);
	}, [signer, L2DefaultProvider, network?.id]);

	return <ModulesContext.Provider value={governanceModules}>{children}</ModulesContext.Provider>;
};

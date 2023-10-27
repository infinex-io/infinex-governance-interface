import { ethers } from 'ethers';
import ElectionModuleABI from 'contracts/ElectionModule.json';
import CCTokenABI from 'contracts/CCToken.json'
import InvestorTokenABI from 'contracts/InvestorToken.json'
import { useConnectorContext } from 'containers/Connector';
import {
	CCToken,
	coreContributorCouncil,
	ecosystemCouncil,
	tradeCouncil,
	treasuryCouncil,
	investorToken,
} from 'constants/addresses';
import {
	createContext,
	useContext,
	useEffect,
	useState,
	FunctionComponent,
	PropsWithChildren,
} from 'react';
import { DeployedModules } from 'constants/config';
import { NETWORK_ID } from '../../utils/network';

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
		const wrongNetwork = network?.id !== NETWORK_ID;

		// Uncomment next line for testing forks
		// if (!signer) return;

		const provider = !!signer && !wrongNetwork ? signer : L2DefaultProvider;

		const TradeCouncilModule = new ethers.Contract(
			tradeCouncil,
			ElectionModuleABI.abi,
			provider
		);

		const modules = {} as GovernanceModule;

		modules[DeployedModules.TRADE_COUNCIL] = {
			address: tradeCouncil,
			contract: TradeCouncilModule,
		};

		const CoreContributorCouncilModule = new ethers.Contract(
			coreContributorCouncil,
			ElectionModuleABI.abi,
			provider
		);

		modules[DeployedModules.CORE_CONTRIBUTOR_COUNCIL] = {
			address: coreContributorCouncil,
			contract: CoreContributorCouncilModule,
		};

		const EcosystemCouncilModule = new ethers.Contract(ecosystemCouncil, ElectionModuleABI.abi, provider);

		modules[DeployedModules.ECOSYSTEM_COUNCIL] = {
			address: ecosystemCouncil,
			contract: EcosystemCouncilModule,
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

		const CCTokenModule = new ethers.Contract(
			CCToken,
			CCTokenABI.abi,
			provider
		)

		modules[DeployedModules.CC_TOKEN] = {
			address: CCToken,
			contract: CCTokenModule
		}

		const investorTokenModule = new ethers.Contract(
			investorToken, 
			InvestorTokenABI.abi,
			provider
		)

		modules[DeployedModules.INVESTOR_TOKEN] = {
			address: investorToken,
			contract: investorTokenModule
		}
		
		setGovernanceModules(modules);
	}, [signer, L2DefaultProvider, network?.id]);

	return <ModulesContext.Provider value={governanceModules}>{children}</ModulesContext.Provider>;
};

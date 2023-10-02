import { DeployedModules } from 'constants/config';
import { useConnectorContext } from 'containers/Connector';
import useIsNominated from './useIsNominatedQuery';

export const useIsNominatedCouncils = (walletAddress: string) => {
	const trade = useIsNominated(DeployedModules.TRADE_COUNCIL, walletAddress);
	const ecosystem = useIsNominated(DeployedModules.ECOSYSTEM_COUNCIL, walletAddress);
	const coreContributor = useIsNominated(DeployedModules.CORE_CONTRIBUTOR_COUNCIL, walletAddress);
	const treasury = useIsNominated(DeployedModules.TREASURY_COUNCIL, walletAddress);
	return {
		trade,
		ecosystem,
		coreContributor,
		treasury,
	};
};

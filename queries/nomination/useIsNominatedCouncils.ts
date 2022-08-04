import { DeployedModules } from 'constants/config';
import { useConnectorContext } from 'containers/Connector';
import useIsNominated from './useIsNominatedQuery';

export const useIsNominatedCouncils = (walletAddress: string) => {
	const spartan = useIsNominated(DeployedModules.SPARTAN_COUNCIL, walletAddress);
	const grants = useIsNominated(DeployedModules.GRANTS_COUNCIL, walletAddress);
	const ambassador = useIsNominated(DeployedModules.AMBASSADOR_COUNCIL, walletAddress);
	const treasury = useIsNominated(DeployedModules.TREASURY_COUNCIL, walletAddress);
	return {
		spartan,
		grants,
		ambassador,
		treasury,
	};
};

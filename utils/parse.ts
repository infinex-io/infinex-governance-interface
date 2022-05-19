import { DeployedModules } from 'containers/Modules';

export const parseQuery = (
	council?: string
): {
	index: number;
	module: DeployedModules;
	name: 'spartan' | 'grants' | 'ambassador' | 'treasury';
} => {
	switch (council) {
		case 'spartan':
			return { index: 0, module: DeployedModules.SPARTAN_COUNCIL, name: 'spartan' };
		case 'grants':
			return { index: 1, module: DeployedModules.GRANTS_COUNCIL, name: 'grants' };
		case 'ambassador':
			return { index: 2, module: DeployedModules.AMBASSADOR_COUNCIL, name: 'ambassador' };
		case 'treasury':
			return { index: 3, module: DeployedModules.TREASURY_COUNCIL, name: 'treasury' };
		default:
			return { index: 0, module: DeployedModules.SPARTAN_COUNCIL, name: 'spartan' };
	}
};

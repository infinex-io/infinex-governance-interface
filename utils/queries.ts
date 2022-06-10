import { DeployedModules } from 'containers/Modules';

export const nomineesQueryKeys = (council: DeployedModules) => ['nominees', council];
export const isNominatedQueryKeys = (council: DeployedModules, walletAddress: string) => [
	'nominees',
	'isNominated',
	walletAddress,
	council,
];
export const isNominatedForCouncilQueryKeys = (walletAddress: string) => [
	'nominees',
	'isNominatedForCouncil',
	walletAddress,
];

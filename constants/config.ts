import { DeployedModules } from 'containers/Modules';

export const COUNCIL_SLUGS = ['spartan', 'grants', 'ambassador', 'treasury'];

export type CouncilsDictionaryType = {
	slug: string;
	label: string;
	abbreviation: string;
	image: string;
	module: DeployedModules;
};

export const COUNCILS_DICTIONARY: CouncilsDictionaryType[] = [
	{
		slug: 'spartan',
		label: 'Spartan',
		abbreviation: 'sc',
		image: '/logos/spartan-council.svg',
		module: DeployedModules.SPARTAN_COUNCIL,
	},
	{
		slug: 'grants',
		label: 'Grants',
		abbreviation: 'gc',
		image: '/logos/grants-council.svg',
		module: DeployedModules.GRANTS_COUNCIL,
	},
	{
		slug: 'ambassador',
		label: 'Ambassador',
		abbreviation: 'ac',
		image: '/logos/ambassador-council.svg',
		module: DeployedModules.AMBASSADOR_COUNCIL,
	},
	{
		slug: 'treasury',
		label: 'Treasury',
		abbreviation: 'tc',
		image: '/logos/treasury-council.svg',
		module: DeployedModules.TREASURY_COUNCIL,
	},
];

export const PAGE_SIZE = 6;

export const LOCAL_STORAGE_KEYS = {
	SELECTED_WALLET: 'selectedWallet',
	WATCHED_WALLETS: 'watchedWallets',
};

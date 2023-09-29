export const COUNCIL_SLUGS = ['trade', 'ecosystem', 'core-contributors', 'treasury'];

export enum DeployedModules {
	TRADE_COUNCIL = 'trade council',  // trade
	CORE_CONTRIBUTORS_COUNCIL = 'core contributors council', // coreContributor
	ECOSYSTEM_COUNCIL = 'ecosystem council', // ecosystem
	TREASURY_COUNCIL = 'treasury council',
}

export type CouncilsDictionaryType = {
	slug: string;
	label: string;
	abbreviation: string;
	image: string;
	module: DeployedModules;
};

export const COUNCILS_DICTIONARY: CouncilsDictionaryType[] = [
	{
		slug: 'trade',
		label: 'Trade',
		abbreviation: 'tr',
		image: '/logos/trade-council.svg',
		module: DeployedModules.TRADE_COUNCIL,
	},
	{
		slug: 'ecosystem',
		label: 'Ecosystem',
		abbreviation: 'ec',
		image: '/logos/ecosystem-council.svg',
		module: DeployedModules.ECOSYSTEM_COUNCIL,
	},
	{
		slug: 'core-contributors',
		label: 'Core Contributors',
		abbreviation: 'cc',
		image: '/logos/coreContributor-council.svg',
		module: DeployedModules.CORE_CONTRIBUTORS_COUNCIL,
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

export const SESSION_STORAGE_KEYS = {
	TERMS_CONDITIONS_ACCEPTED: 'termsConditionsAccepted',
};

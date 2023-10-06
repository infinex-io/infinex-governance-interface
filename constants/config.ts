export const COUNCIL_SLUGS = ['trade', 'ecosystem', 'core-contributor', 'treasury'];

export enum DeployedModules {
	TRADE_COUNCIL = 'trade council',  // trade
	CORE_CONTRIBUTOR_COUNCIL = 'core contributor council', // ecosystem
	ECOSYSTEM_COUNCIL = 'ecosystem council', // coreContributor
	TREASURY_COUNCIL = 'treasury council',
}

export type CouncilsDictionaryType = {
	slug: string;
	label: string;
	abbreviation: string;
	image: string;
	module: DeployedModules;
};

// export const INFINEX_COUNCIL: CouncilsDictionaryType = {
// 	slug: 'infinex',
// 	label: 'Infinex',
// 	abbreviation: 'in',
// 	image: '/logos/infinex-council.svg',
// 	module: null as any
// }

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
		slug: 'core-contributor',
		label: 'Core Contributor',
		abbreviation: 'cc',
		image: '/logos/core-contributor-council.svg',
		module: DeployedModules.CORE_CONTRIBUTOR_COUNCIL ,
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

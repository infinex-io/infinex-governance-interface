import { DeployedModules } from 'containers/Modules';

export const parseQuery = (
	councilOrIndex?: string | number
): {
	index: number;
	module: DeployedModules;
	name: 'trade' | 'ecosystem' | 'coreContributor' | 'treasury';
} => {
	switch (councilOrIndex) {
		case 'trade':
		case 0:
			return { index: 0, module: DeployedModules.TRADE_COUNCIL, name: 'trade' };
		case 'ecosystem':
		case 1:
			return { index: 1, module: DeployedModules.ECOSYSTEM_COUNCIL, name: 'ecosystem' };
		case 'coreContributor':
		case 2:
			return { index: 2, module: DeployedModules.CORE_CONTRIBUTORS_COUNCIL, name: 'coreContributor' };
		case 'treasury':
		case 3:
			return { index: 3, module: DeployedModules.TREASURY_COUNCIL, name: 'treasury' };
		default:
			return { index: 0, module: DeployedModules.TRADE_COUNCIL, name: 'trade' };
	}
};

export function parseCouncil(index: number): {
	cta: string;
	button: string;
	variant: 'default' | 'outline';
	color: string;
	headlineLeft: string;
	headlineRight: string;
	secondButton?: string;
} {
	switch (index) {
		case 1:
			return {
				cta: 'landing-page.cards.cta.nomination',
				button: 'landing-page.cards.button.nomination',
				color: 'ui-gradient-orange text-black',
				variant: 'default',
				headlineLeft: 'landing-page.cards.candidates',
				headlineRight: 'landing-page.cards.received',
				secondButton: 'landing-page.cards.nominees',
			};
		case 2:
			return {
				cta: 'landing-page.cards.cta.vote',
				button: 'landing-page.cards.button.vote',
				color: 'bg-green text-black',
				variant: 'default',
				headlineLeft: 'landing-page.cards.candidates',
				headlineRight: 'landing-page.cards.received',
			};
		case 3: {
			return {
				cta: 'landing-page.cards.cta.eval',
				button: 'landing-page.cards.button.nominees',
				color: 'bg-purple',
				variant: 'outline',
				headlineLeft: 'landing-page.cards.members',
				headlineRight: 'landing-page.cards.received',
			};
		}
		default:
			return {
				cta: 'landing-page.cards.cta.closed',
				button: 'landing-page.cards.button.closed',
				color: 'bg-purple',
				variant: 'outline',
				headlineLeft: 'landing-page.cards.members',
				headlineRight: 'landing-page.cards.received',
			};
	}
}

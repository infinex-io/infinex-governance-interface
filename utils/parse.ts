import { DeployedModules } from 'containers/Modules';

export const parseQuery = (
	councilOrIndex?: string | number
): {
	index: number;
	module: DeployedModules;
	name: 'spartan' | 'grants' | 'ambassador' | 'treasury';
} => {
	switch (councilOrIndex) {
		case 'spartan':
		case 0:
			return { index: 0, module: DeployedModules.SPARTAN_COUNCIL, name: 'spartan' };
		case 'grants':
		case 1:
			return { index: 1, module: DeployedModules.GRANTS_COUNCIL, name: 'grants' };
		case 'ambassador':
		case 2:
			return { index: 2, module: DeployedModules.AMBASSADOR_COUNCIL, name: 'ambassador' };
		case 'treasury':
		case 3:
			return { index: 3, module: DeployedModules.TREASURY_COUNCIL, name: 'treasury' };
		default:
			return { index: 0, module: DeployedModules.SPARTAN_COUNCIL, name: 'spartan' };
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

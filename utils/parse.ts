import { Colors } from 'components/old-ui';
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

export function parseCouncel(index: number): {
	cta: string;
	button: string;
	variant: 'default' | 'outline';
	color: Colors;
	headlineLeft: string;
	headlineRight: string;
	secondButton?: string;
} {
	switch (index) {
		case 1:
			return {
				cta: 'landing-page.cards.cta.nomination',
				button: 'landing-page.cards.button.nomination',
				color: 'orange',
				variant: 'default',
				headlineLeft: 'landing-page.cards.candidates',
				headlineRight: 'landing-page.cards.received',
				secondButton: 'landing-page.cards.nominees',
			};
		case 2:
			return {
				cta: 'landing-page.cards.cta.vote',
				button: 'landing-page.cards.button.vote',
				color: 'green',
				variant: 'default',
				headlineLeft: 'landing-page.cards.candidates',
				headlineRight: 'landing-page.cards.received',
			};
		default:
			return {
				cta: 'landing-page.cards.cta.closed',
				button: 'landing-page.cards.button.closed',
				color: 'purple',
				variant: 'outline',
				headlineLeft: 'landing-page.cards.members',
				headlineRight: 'landing-page.cards.received',
			};
	}
}

import { DeployedModules } from 'containers/Modules';

export const COUNCIL_SLUGS = ['spartan', 'grants', 'ambassador', 'treasury'];

export const COUNCILS_DICTIONARY: Record<
	DeployedModules,
	{
		slug: string;
		label: string;
		abbreviation: string;
	}
> = {
	'spartan council': {
		slug: 'spartan',
		label: 'Spartan',
		abbreviation: 'sc',
	},
	'grants council': {
		slug: 'grants',
		label: 'Grants',
		abbreviation: 'gc',
	},
	'ambassador council': {
		slug: 'ambassador',
		label: 'Ambassador',
		abbreviation: 'ac',
	},
	'treasury council': {
		slug: 'treasury',
		label: 'Treasury',
		abbreviation: 'tc',
	},
};

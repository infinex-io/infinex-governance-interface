import { sortToOwnCard } from 'utils/sort';

describe('sortToOwn', () => {
	it('should put the wanted entity in the array upfront without losing the other entities', () => {
		const myEntity = 'a';
		const entitiesWithMyEntity = [
			{ address: 'b' },
			{ address: 'a' },
			{ address: 'c' },
			{ address: 'd' },
		];
		const result = sortToOwnCard(entitiesWithMyEntity as any, myEntity);
		expect(JSON.stringify(result)).toBe(
			JSON.stringify([{ address: 'a' }, { address: 'b' }, { address: 'c' }, { address: 'd' }])
		);
	});
});

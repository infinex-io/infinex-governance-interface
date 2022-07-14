import { render } from '@testing-library/react';
import Avatar from './';
import React from 'react';

test('Avatar component should show blocking if provided link does not have ipfs as protocol', () => {
	const { container } = render(
		<Avatar
			walletAddress="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
			url="https://coinmarketcap.com/"
		></Avatar>
	);
	expect(container.querySelector('.rounded-full')?.nodeName === 'CANVAS').toBe(true);
});

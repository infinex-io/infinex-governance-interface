import { render, screen } from '@testing-library/react';
import Avatar from './';
import React from 'react';

test('Avatar component should show blockies component if provided link is not ipfs protocol', () => {
	const { container } = render(
		<Avatar
			walletAddress="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
			url="https://coinmarketcap.com/"
			className="TEST-CLASS"
		></Avatar>
	);
	expect(container.querySelector('.TEST-CLASS')?.nodeName === 'CANVAS').toBe(true);
});

test('Avatar component should show img tag if provided link is not ipfs protocol', () => {
	render(
		<Avatar
			walletAddress="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
			url="ipfs://QmdeUUmDkcjVAxAbFkUhqjASTazFWCsZ4s5uZsT7hA9u3t"
		></Avatar>
	);
	expect(screen.getByTestId('avatar-image')?.nodeName === 'IMG').toBe(true);
});

test('Avatar component should throw error when invalid url is provided', () => {
	const errorConsole = jest.spyOn(console, 'error').mockImplementation();
	render(
		<Avatar walletAddress="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" url="invalidURL"></Avatar>
	);
	expect(errorConsole).toBeCalled();
});

import { NetworkId } from '@synthetixio/contracts-interface';
import { providers } from 'ethers';

declare global {
	interface Window {
		ethereum?: providers.Web3Provider;
	}
}

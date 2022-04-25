import { NetworkId } from '@synthetixio/contracts-interface';
import type { MetaMaskInpageProvider } from '@metamask/providers';
import { theme } from '@synthetixio/ui';

declare global {
	interface Window {
		web3?: {
			eth?: {
				net: {
					getId: () => NetworkId;
				};
			};
			version: {
				getNetwork(cb: (err: Error | undefined, networkId: NetworkId) => void): void;
				network: NetworkId;
			};
		};
		ethereum?: MetaMaskInpageProvider;
	}
	namespace NodeJS {
		interface ProcessEnv {
			NEXT_INFURA_PROJECT_ID: string;
		}
	}
}

type ThemeInterface = typeof theme;

declare module 'styled-components' {
	interface DefaultTheme extends ThemeInterface {}
}

// Trick to make this a valid module:
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};

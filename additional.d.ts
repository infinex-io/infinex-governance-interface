import { NetworkId } from '@synthetixio/contracts-interface';
import type { MetaMaskInpageProvider } from '@metamask/providers';

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
}

/**
 * Declare known environment variables.
 * Enables auto-completion when using "process.env.".
 * Makes it easier to find env vars, and helps avoid typo mistakes.
 *
 * Unlisted env vars will still be usable.
 *
 * @see https://stackoverflow.com/a/53981706/2391795
 */
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NEXT_INFURA_PROJECT_ID: string;
		}
	}
}

// Trick to make this a valid module:
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};

import { theme } from '@synthetixio/ui';

type ThemeInterface = typeof theme;

declare module 'styled-components' {
	interface DefaultTheme extends ThemeInterface {}
}

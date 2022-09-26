import React, {
	useEffect,
	useMemo,
	useContext,
	createContext,
	useCallback,
	useReducer,
} from 'react';
import { ethers } from 'ethers';
import { onboard as Web3Onboard } from './config';
import { LOCAL_STORAGE_KEYS } from 'constants/config';
import { AppEvents, initialState, Network, reducer } from './reducer';
import { getIsOVM, isSupportedNetworkId } from 'utils/network';
import { NetworkIdByName, NetworkNameById, SynthetixJS } from '@synthetixio/contracts-interface';
import { getChainIdHex, getNetworkIdFromHex } from 'utils/infura';
import { AppState, OnboardAPI } from '@web3-onboard/core';

type ConnectorContextType = {
	network: Network | null;
	provider: ethers.providers.Web3Provider | null;
	signer: ethers.Signer | null;
	synthetixjs: SynthetixJS | null;
	isAppReady: boolean;
	walletAddress: string | null;
	walletWatched: string | null;
	walletType: string | null;
	onboard: OnboardAPI | null;

	ensName: string | null;
	ensAvatar: string | null;
	L1DefaultProvider: ethers.providers.InfuraProvider;
	L2DefaultProvider: ethers.providers.StaticJsonRpcProvider | ethers.providers.FallbackProvider;
	connectWallet: () => Promise<void>;
	disconnectWallet: () => Promise<void>;
	switchAccounts: () => Promise<void>;
	isHardwareWallet: boolean;
	isWalletConnected: boolean;
};

const ConnectorContext = createContext<unknown>(null);

export const useConnectorContext = () => {
	return useContext(ConnectorContext) as ConnectorContextType;
};

export const ConnectorContextProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const {
		isAppReady,
		provider,
		network,
		signer,
		walletAddress,
		walletWatched,
		ensName,
		ensAvatar,
		onboard,
		walletType,
	} = state;

	const L1DefaultProvider = useMemo(
		() => new ethers.providers.AlchemyProvider(1, process.env.NEXT_PUBLIC_ALCHEMY_KEY_MAINNET),
		[]
	);
	const L2DefaultProvider = useMemo(
		() => new ethers.providers.AlchemyProvider(10, process.env.NEXT_PUBLIC_ALCHEMY_KEY_OPTIMISM),
		[]
	);

	const updateState = useCallback(
		(update: AppState) => {
			if (update.wallets.length > 0) {
				const wallet = update.wallets[0].accounts[0];

				const { label } = update.wallets[0];
				const { id } = update.wallets[0].chains[0];
				const networkId = getNetworkIdFromHex(id);

				const isSupported = isSupportedNetworkId(networkId);

				if (!isSupported) {
					// Switch to mainnet ovm by default
					(async () => {
						await onboard?.setChain({ chainId: getChainIdHex(NetworkIdByName['mainnet-ovm']) });
					})();
				} else {
					const network = {
						id: networkId,
						name: NetworkNameById[networkId],
						useOvm: getIsOVM(networkId),
					};

					const provider = new ethers.providers.Web3Provider(update.wallets[0].provider, {
						name: network.name,
						chainId: networkId,
					});

					const signer = provider.getSigner();

					dispatch({
						type: AppEvents.CONFIG_UPDATE,
						payload: {
							address: wallet.address,
							walletWatched: null,
							walletType: label,
							network,
							provider,
							signer,
							ensName: wallet?.ens?.name || null,
							ensAvatar: wallet?.ens?.avatar?.url || null,
						},
					});

					const connectedWallets = update.wallets.map(({ label }) => label);
					localStorage.setItem(
						LOCAL_STORAGE_KEYS.SELECTED_WALLET,
						JSON.stringify(connectedWallets)
					);
				}
			} else {
				dispatch({ type: AppEvents.WALLET_DISCONNECTED });
			}
		},
		[onboard]
	);

	useEffect(() => {
		dispatch({ type: AppEvents.APP_READY, payload: Web3Onboard }); //
	}, []);

	useEffect(() => {
		const previousWalletsSerialised = localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTED_WALLET);
		const previousWallets: string[] | null = previousWalletsSerialised
			? JSON.parse(previousWalletsSerialised)
			: null;

		if (onboard && previousWallets) {
			(async () => {
				try {
					await onboard.connectWallet({
						autoSelect: {
							label: previousWallets[0],
							disableModals: true,
						},
					});
				} catch (error) {
					console.log(error);
				}
			})();
		}

		if (onboard) {
			const state = onboard.state.select();
			const { unsubscribe } = state.subscribe(updateState);

			return () => {
				if (process.env.NODE_ENV !== 'development' && unsubscribe) unsubscribe();
			};
		}

		// Always keep this hook with the single dependency.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onboard]);

	useEffect(() => {
		if (walletAddress && !ensName) {
			(async () => {
				const ensN: string | null = await L1DefaultProvider.lookupAddress(walletAddress);
				const ensA = ensName ? await L1DefaultProvider.getAvatar(ensName) : null;
				if (ensN) {
					dispatch({ type: AppEvents.SET_ENS, payload: { ensName: ensN, ensAvatar: ensA } });
				}
			})();
		}
	}, [walletAddress, L1DefaultProvider, ensName, network]);

	const connectWallet = useCallback(async () => {
		try {
			if (onboard) {
				await onboard.connectWallet();
			}
		} catch (e) {
			console.log(e);
		}
	}, [onboard]);

	const disconnectWallet = useCallback(() => {
		try {
			if (onboard) {
				const [primaryWallet] = onboard.state.get().wallets;
				onboard.disconnectWallet({ label: primaryWallet?.label });
				localStorage.removeItem(LOCAL_STORAGE_KEYS.SELECTED_WALLET);
				dispatch({ type: AppEvents.WALLET_DISCONNECTED });
			}
		} catch (e) {
			console.log(e);
		}
	}, [onboard]);

	const switchAccounts = useCallback(async () => {
		try {
			if (onboard) {
				await onboard.connectWallet({
					autoSelect: { label: onboard.state.get()?.wallets[0]?.label, disableModals: false },
				});
			}
		} catch (e) {
			console.log(e);
		}
	}, [onboard]);

	const isHardwareWallet = useCallback(() => {
		if (onboard) {
			const walletLabel = onboard.state.get()?.wallets[0]?.label || null;
			return walletLabel === 'Trezor' || walletLabel === 'Ledger';
		}
		return false;
	}, [onboard]);

	return (
		<ConnectorContext.Provider
			value={{
				ensAvatar,
				ensName,
				L1DefaultProvider,
				L2DefaultProvider,
				connectWallet,
				disconnectWallet,
				switchAccounts,
				isHardwareWallet,
				isAppReady,
				provider,
				network,
				signer,
				walletAddress,
				walletWatched,
				onboard,
				walletType,
				isWalletConnected: !!walletAddress,
			}}
		>
			{children}
		</ConnectorContext.Provider>
	);
};

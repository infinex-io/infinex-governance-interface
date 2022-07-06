import React, { useEffect, useMemo, useState, useContext, createContext } from 'react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';

type ConnectorContextType = {
	ensName: string | null;
	ensAvatar: string | null;
	L1DefaultProvider: ethers.providers.InfuraProvider;
	L2DefaultProvider: ethers.providers.StaticJsonRpcProvider | ethers.providers.FallbackProvider;
};

const ConnectorContext = createContext<unknown>(null);

export const useConnectorContext = () => {
	return useContext(ConnectorContext) as ConnectorContextType;
};

export const ConnectorContextProvider: React.FC = ({ children }) => {
	const L1DefaultProvider = useMemo(
		() => new ethers.providers.InfuraProvider(1, process.env.NEXT_PUBLIC_INFURA_PROJECT_ID),
		[]
	);
	const L2DefaultProvider = useMemo(
		() => new ethers.providers.InfuraProvider(10, process.env.NEXT_PUBLIC_INFURA_PROJECT_ID),
		[]
	);
	const accountQuery = useAccount();

	const [ensName, setEnsName] = useState<string | null>(null);
	const [ensAvatar, setEnsAvatar] = useState<string | null>(null);

	useEffect(() => {
		const address = accountQuery.data?.address;
		if (address) {
			try {
				L1DefaultProvider.lookupAddress(address).then((ensName) => {
					if (ensName) {
						setEnsName(ensName);
						L1DefaultProvider.getAvatar(ensName).then((avatar) => {
							setEnsAvatar(avatar);
						});
					}
				});
			} catch (error) {
				console.log('No ENS found for address: ', address);
				console.error(error);
			}
		}
	}, [accountQuery, L1DefaultProvider]);

	return (
		<ConnectorContext.Provider
			value={{
				ensAvatar,
				ensName,
				L1DefaultProvider,
				L2DefaultProvider,
			}}
		>
			{children}
		</ConnectorContext.Provider>
	);
};

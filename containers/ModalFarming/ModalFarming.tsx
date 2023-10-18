import { createContext, FunctionComponent, PropsWithChildren, useContext, useState } from 'react';

type ModalFarmingContextType = {
	modalFarmingIsHidden: boolean;
	setModalFarmingIsHidden: (value: boolean) => void;
	content?: JSX.Element;
	setContent: (value: JSX.Element) => void;
	signatureData: any;
	setSignatureData: (value: any) => void;
};

const ModalFarmingContext = createContext<unknown>(null);

export const useModalFarmingContext = () => {
	return useContext(ModalFarmingContext) as ModalFarmingContextType;
};

export const ModalFarmingContextProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const [modalFarmingIsHidden, setModalFarmingIsHidden] = useState(true);
	const [signatureData, setSignatureData] = useState({});
	const [content, setContent] = useState<JSX.Element | undefined>(undefined);

	return (
		<ModalFarmingContext.Provider
			value={{
				modalFarmingIsHidden,
				setModalFarmingIsHidden,
				content,
				setContent,
				signatureData,
				setSignatureData,
			}}
		>
			{children}
		</ModalFarmingContext.Provider>
	);
};

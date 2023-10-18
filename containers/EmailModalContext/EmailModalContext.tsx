import { createContext, FunctionComponent, PropsWithChildren, useContext, useState } from 'react';

type EmailContextType = {
	modalFarmingIsHidden: boolean;
	setModalFarmingIsHidden: (value: boolean) => void;
	content?: JSX.Element;
	setContent: (value: JSX.Element) => void;
	signatureData: any;
	setSignatureData: (value: any) => void;
};

const EmailModalContext = createContext<unknown>(null);

export const useEmailModalContext = () => {
	return useContext(EmailModalContext) as EmailContextType;
};

export const EmailModalContextProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const [modalFarmingIsHidden, setModalFarmingIsHidden] = useState(false);
	const [signatureData, setSignatureData] = useState({});
	const [content, setContent] = useState<JSX.Element | undefined>(undefined);

	return (
		<EmailModalContext.Provider
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
		</EmailModalContext.Provider>
	);
};

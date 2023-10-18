import { createContext, FunctionComponent, PropsWithChildren, useContext, useState } from 'react';

type EmailContextType = {
	modalFarmingIsHidden: boolean;
	setModalFarmingIsHidden: (value: boolean) => void;
	content?: JSX.Element;
	setContent: (value: JSX.Element) => void;
	signatureData: any;
	setSignatureData: (value: any) => void;
	setLoggedIn: (value: string) => void;
	loggedIn: any;
};

const EmailModalContext = createContext<unknown>(null);

export const useEmailModalContext = () => {
	return useContext(EmailModalContext) as EmailContextType;
};

export const EmailModalContextProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const [modalFarmingIsHidden, setModalFarmingIsHidden] = useState(true);
	const [signatureData, setSignatureData] = useState({});
	const [content, setContent] = useState<JSX.Element | undefined>(undefined);
	const [loggedIn, setLoggedIn] = useState<String>("");

	return (
		<EmailModalContext.Provider
			value={{
				modalFarmingIsHidden,
				setModalFarmingIsHidden,
				content,
				setContent,
				signatureData,
				setSignatureData,
				setLoggedIn,
				loggedIn
			}}
		>
			{children}
		</EmailModalContext.Provider>
	);
};

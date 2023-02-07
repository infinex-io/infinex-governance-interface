import { createContext, FunctionComponent, PropsWithChildren, useContext, useState } from 'react';

type ModalContextType = {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	content?: JSX.Element;
	setContent: (value: JSX.Element) => void;
};

const ModalContext = createContext<unknown>(null);

export const useModalContext = () => {
	return useContext(ModalContext) as ModalContextType;
};

export const ModalContextProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [content, setContent] = useState<JSX.Element | undefined>(undefined);

	return (
		<ModalContext.Provider
			value={{
				isOpen,
				setIsOpen,
				content,
				setContent,
			}}
		>
			{children}
		</ModalContext.Provider>
	);
};

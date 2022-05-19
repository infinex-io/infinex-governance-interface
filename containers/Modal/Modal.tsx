import { createContext, useContext, useState } from 'react';

type ModalContextType = {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	content: JSX.Element | null;
	setContent: (value: JSX.Element) => void;
};

const ModalContext = createContext<unknown>(null);

export const useModalContext = () => {
	return useContext(ModalContext) as ModalContextType;
};

export const ModalContextProvider: React.FC = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [content, setContent] = useState<JSX.Element | null>(null);

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

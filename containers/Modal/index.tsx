import { useState } from 'react';
import { createContainer } from 'unstated-next';

function useModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [content, setContent] = useState<undefined | JSX.Element>(undefined);

	return {
		isOpen,
		setIsOpen,
		content,
		setContent,
	};
}

const Modal = createContainer(useModal);

export default Modal;

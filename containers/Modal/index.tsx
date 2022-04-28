import { useState } from 'react';
import { createContainer } from 'unstated-next';

function useModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [content, setContent] = useState<null | JSX.Element>(null);

	return {
		isOpen,
		setIsOpen,
		content,
		setContent,
	};
}

const Modal = createContainer(useModal);

export default Modal;

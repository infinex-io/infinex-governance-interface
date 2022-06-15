import React, { PropsWithChildren, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

interface ModalProps {
	open: boolean;
	modalContent?: JSX.Element;
}

export default function Modal({ open, modalContent, children }: PropsWithChildren<ModalProps>) {
	const nodeRef = useRef(null);
	return (
		<>
			<CSSTransition unmountOnExit classNames="ui-slide" in={open} nodeRef={nodeRef} timeout={500}>
				<div
					className="w-full h-full absolute left-0 right-0 top-0 h-full mx-auto z-99 ui-bg-overlay"
					ref={nodeRef}
				>
					<div className="modal-content">{modalContent}</div>
				</div>
			</CSSTransition>

			{children}
		</>
	);
}

import React, { PropsWithChildren, useRef } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

interface ModalProps {
	open: boolean;
	modalContent?: JSX.Element;
}

export default function Modal({
	open,
	modalContent,
	children,
	...rest
}: PropsWithChildren<ModalProps>) {
	const nodeRef = useRef(null);
	return (
		<StyledModalWrapper {...rest}>
			<CSSTransition
				unmountOnExit
				classNames="ui-slide"
				in={open}
				nodeRef={nodeRef}
				timeout={{ enter: 500, exit: 300 }}
			>
				<StyledModalContentWrapper ref={nodeRef}>{modalContent}</StyledModalContentWrapper>
			</CSSTransition>

			{children}
		</StyledModalWrapper>
	);
}

const StyledModalWrapper = styled.div`
	position: relative;
`;

const StyledModalContentWrapper = styled.div`
	position: absolute;
	z-index: 2;
	left: 10px;
	top: 0;
	width: calc(99% - 10px);
	height: calc(99% - 10px);
`;

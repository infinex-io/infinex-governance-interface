import { CloseIcon, Flex } from 'components/old-ui';
import { H1 } from 'components/Headlines/H1';
import Modal from 'containers/Modal';
import { PropsWithChildren } from 'react';
import styled from 'styled-components';

export default function SecondaryModal({
	children,
	maxWidth,
}: PropsWithChildren<{ maxWidth?: string }>) {
	const { setIsOpen } = Modal.useContainer();
	return (
		<StyledSecondaryModalWrapper direction="column" alignItems="center" maxWidth={maxWidth}>
			<StyledCloseIcon onClick={() => setIsOpen(false)} />
			{children}
		</StyledSecondaryModalWrapper>
	);
}

const StyledSecondaryModalWrapper = styled(Flex)<{ maxWidth?: string }>`
	position: relative;
	background: ${({ theme }) => theme.colors.gradients.grey};
	max-width: ${({ maxWidth }) => maxWidth && maxWidth};
	box-shadow: 0px 14px 14px rgba(0, 0, 0, 0.25);
	border-radius: 20px;
`;

const StyledCloseIcon = styled(CloseIcon)`
	position: absolute;
	top: 10px;
	right: 10px;
	cursor: pointer;
`;

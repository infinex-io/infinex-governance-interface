import { CloseIcon, Flex, IconButton } from '@synthetixio/ui';
import Modal from 'containers/Modal';
import { PropsWithChildren } from 'react';
import styled from 'styled-components';

export default function BaseModal({ children, headline }: PropsWithChildren<{ headline: string }>) {
	const { setIsOpen } = Modal.useContainer();
	return (
		<StyledNominateModalWrapper direction="column" alignItems="center">
			<StyledIconButton onClick={() => setIsOpen(false)} active rounded>
				<CloseIcon active />
			</StyledIconButton>
			<StyledModalHeadline>{headline}</StyledModalHeadline>
			{children}
		</StyledNominateModalWrapper>
	);
}

const StyledNominateModalWrapper = styled(Flex)`
	background: url('/images/modal-background.svg');
	height: 100%;
	width: 100%;
	background-repeat: no-repeat;
	background-size: contain;
	position: relative;
	padding-top: 10%;
`;

const StyledModalHeadline = styled.h1`
	font-family: 'Inter Bold';
	font-size: 3.33rem;
	color: ${({ theme }) => theme.colors.white};
`;

const StyledIconButton = styled(IconButton)`
	position: absolute;
	right: 40px;
	top: 40px;
`;

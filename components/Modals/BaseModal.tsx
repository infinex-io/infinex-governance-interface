import { Card, CloseIcon, Flex, IconButton } from 'components/old-ui';
import { H1 } from 'components/Headlines/H1';
import { useModalContext } from 'containers/Modal';
import { PropsWithChildren } from 'react';
import styled from 'styled-components';

export default function BaseModal({ children, headline }: PropsWithChildren<{ headline: string }>) {
	const { setIsOpen } = useModalContext();
	return (
		<StyledBaseModalWrapper color="purple">
			<StyledFlex direction="column" alignItems="center" className="darker-60">
				<StyledIconButton onClick={() => setIsOpen(false)} active rounded>
					<CloseIcon active />
				</StyledIconButton>
				<H1>{headline}</H1>
				{children}
			</StyledFlex>
		</StyledBaseModalWrapper>
	);
}

const StyledBaseModalWrapper = styled(Card)`
	background-repeat: no-repeat;
	background-size: contain;
	position: relative;
`;

const StyledFlex = styled(Flex)`
	height: 100%;
	width: 100%;
	padding-top: 10%;
`;

const StyledIconButton = styled(IconButton)`
	position: absolute;
	right: 40px;
	top: 40px;
`;

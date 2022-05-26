import { Card, CloseIcon, Flex, IconButton } from 'components/old-ui';
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
				<h1 className="tg-title-h1 text-white">{headline}</h1>
				{children}
			</StyledFlex>
		</StyledBaseModalWrapper>
	);
}

const StyledBaseModalWrapper = styled(Card)`
	background-repeat: no-repeat;
	background-size: contain;
	position: relative;
	max-height: calc(100vh - 40px);
`;

const StyledFlex = styled(Flex)`
	height: 100%;
	max-height: calc(100vh - 40px);
	width: 100%;
	padding-top: 10%;
`;

const StyledIconButton = styled(IconButton)`
	position: absolute;
	right: 40px;
	top: 40px;
`;

import { PropsWithChildren } from 'react';
import styled from 'styled-components';

export default function RemainingTime({
	glow,
	children,
	...rest
}: PropsWithChildren<{ glow?: boolean }>) {
	return (
		<StyledTime glow={glow} {...rest}>
			{children}
		</StyledTime>
	);
}

const StyledTime = styled.span<{ glow?: boolean }>`
	color: ${({ theme }) => theme.colors.green};
	font-family: 'GT America Mono';
	font-size: 1.33rem;
	text-shadow: ${({ glow }) => glow && '0px 0px 15px rgba(0, 209, 255, 0.6)'};
`;

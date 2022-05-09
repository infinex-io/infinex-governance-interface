import { Colors } from '@synthetixio/ui';
import { PropsWithChildren } from 'react';
import styled from 'styled-components';

export default function RemainingTime({
	glow,
	children,
	color,
	...rest
}: PropsWithChildren<{ glow?: boolean; color?: Colors }>) {
	return (
		<StyledTime glow={glow} color={color} {...rest}>
			{children}
		</StyledTime>
	);
}

const StyledTime = styled.span<{ glow?: boolean; color?: Colors }>`
	color: ${({ theme, color }) => (color ? theme.colors[color] : theme.colors.green)};
	font-family: 'GT America Mono';
	font-size: 1.33rem;
	text-shadow: ${({ glow }) => glow && '0px 0px 15px rgba(0, 209, 255, 0.6)'};
`;

import { PropsWithChildren } from 'react';
import styled from 'styled-components';

interface FlexProps {
	direction?: 'column';
	justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-evenly' | 'space-around';
	alignItems?: 'flex-start' | 'flex-end' | 'center' | 'space-evenly' | 'space-around' | 'baseline';
}

export default function Flex({
	direction,
	justifyContent,
	alignItems,
	children,
	...rest
}: PropsWithChildren<FlexProps>) {
	return (
		<StyledFlex
			{...rest}
			direction={direction}
			justifyContent={justifyContent}
			alignItems={alignItems}
		>
			{children}
		</StyledFlex>
	);
}

const StyledFlex = styled.div<FlexProps>`
	display: flex;
	${({ direction }) => direction && `flex-direction: ${direction}`};
	${({ justifyContent }) => justifyContent && `justify-content: ${justifyContent}`};
	${({ alignItems }) => alignItems && `align-items: ${alignItems}`};
`;

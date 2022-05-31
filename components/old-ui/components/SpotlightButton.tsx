import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import colors from '../styles/colors';
import spacings from '../styles/spacings';

interface SpotlightButtonProps extends HTMLAttributes<HTMLButtonElement> {
	text: string;
	active: boolean;
	onClick: () => void;
	size?: 'lg';
}

export default function SpotlightButton({
	text,
	active,
	onClick,
	size,
	...rest
}: SpotlightButtonProps) {
	return (
		<StyledSpotlightButton onClick={onClick} {...rest}>
			<StyledText active={active} size={size}>
				{text}
			</StyledText>
			{active && <StyledSpotlight />}
		</StyledSpotlightButton>
	);
}

const StyledSpotlightButton = styled.button`
	position: relative;
	height: 32px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	outline: 0;
	border: 0;
	background-color: transparent;
	cursor: pointer;
`;

const StyledText = styled.span<{
	active: SpotlightButtonProps['active'];
	size?: SpotlightButtonProps['size'];
}>`
	font-family: 'GT America';
	font-style: normal;
	font-weight: 400;
	font-size: ${({ size }) => (size === 'lg' ? '2rem' : '0.87rem')};
	margin-bottom: ${spacings.tiny};
	color: ${({ active }) => (active ? 'white' : colors.grey)};
`;

const StyledSpotlight = styled.div`
	position: absolute;
	bottom: 0px;
	width: 100%;
	border-radius: 2px;
	height: 2px;
	background-color: ${colors.lightBlue};
	transition: background-color 200ms ease-in;
`;

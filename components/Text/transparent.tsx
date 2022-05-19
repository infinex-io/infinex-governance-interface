import { theme } from 'components/old-ui';
import styled from 'styled-components';

export const TransparentText = styled.span<{
	gradient?: keyof typeof theme.colors.gradients;
	clickable?: boolean;
}>`
	${({ clickable }) => clickable && 'cursor: pointer'};
	font-family: 'Inter';
	font-weight: 400;
	font-size: 0.87rem;
	line-height: 18px;
	text-align: center;
	background: ${({ gradient }) => gradient};
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
`;

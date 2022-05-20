import { Colors } from 'components/old-ui';
import styled from 'styled-components';

export const Text = styled.span<{ color?: Colors }>`
	font-family: 'Inter';
	font-weight: 400;
	font-size: 0.87rem;
	line-height: 18px;
	text-align: center;
	${({ color, theme }) => {
		return color ? `color: ${theme.colors[color]}` : 'opacity: 0.5;';
	}}
`;

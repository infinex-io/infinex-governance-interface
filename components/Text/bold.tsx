import { Colors } from 'components/old-ui';
import styled from 'styled-components';

export const TextBold = styled.span<{ color?: Colors }>`
	font-family: 'Inter';
	font-weight: 700;
	font-size: 0.87rem;
	line-height: 18px;
	text-align: center;
	${({ color, theme }) => {
		return color ? `color: ${theme.colors[color]}` : 'opacity: 0.5;';
	}}
`;

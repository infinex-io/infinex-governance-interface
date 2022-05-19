import { Colors } from 'components/old-ui';
import styled from 'styled-components';

export const H5 = styled.h5<{ color?: Colors }>`
	font-family: 'Inter Bold';
	font-weight: 700;
	font-size: 0.87rem;
	line-height: 21px;
	text-align: center;
	color: ${({ theme, color }) => color && theme.colors[color]};
	margin: 0;
`;

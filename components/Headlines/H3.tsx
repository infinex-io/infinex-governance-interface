import styled from 'styled-components';

export const H3 = styled.h3`
	font-family: 'GT America';
	font-size: 0.87rem;
	line-height: 1.937rem;
	text-align: center;
	color: ${({ theme }) => theme.colors.white};
	margin: ${({ theme }) => theme.spacings.tiny};
`;

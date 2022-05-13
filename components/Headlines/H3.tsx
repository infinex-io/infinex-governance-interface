import styled from 'styled-components';

export const H3 = styled.h3`
	font-family: 'GT America';
	font-size: 1.16rem;
	line-height: 1.25rem;
	text-align: center;
	color: ${({ theme }) => theme.colors.white};
	margin: ${({ theme }) => theme.spacings.tiny};
`;

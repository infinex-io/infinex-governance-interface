import styled from 'styled-components';

export const H2 = styled.h2`
	font-family: 'GT America';
	font-size: 2rem;
	line-height: 2.16rem;
	text-align: center;
	color: ${({ theme }) => theme.colors.white};
	margin: ${({ theme }) => theme.spacings.tiny};
`;

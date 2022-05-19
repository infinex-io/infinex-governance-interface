import styled from 'styled-components';

export const H2 = styled.h2`
	font-family: 'GT America';
	font-size: 1.5rem;
	line-height: 1.62rem;
	text-align: center;
	color: ${({ theme }) => theme.colors.white};
	margin: ${({ theme }) => theme.spacings.tiny};
`;

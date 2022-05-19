import styled from 'styled-components';

export const H1 = styled.h1`
	font-family: 'Inter Bold';
	font-size: 2.5rem;
	line-height: 2.75rem;
	text-align: center;
	color: ${({ theme }) => theme.colors.white};
	margin: ${({ theme }) => theme.spacings.tiny};
`;

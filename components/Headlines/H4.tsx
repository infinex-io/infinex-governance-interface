import styled from 'styled-components';

export const H4 = styled.h4`
	font-family: 'Inter Bold';
	font-size: 1.5rem;
	line-height: 1.58rem;
	text-align: center;
	color: ${({ theme }) => theme.colors.white};
	margin: ${({ theme }) => theme.spacings.tiny};
`;

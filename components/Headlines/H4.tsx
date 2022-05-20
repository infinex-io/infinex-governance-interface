import styled from 'styled-components';

export const H4 = styled.h4<{ align?: string }>`
	font-family: 'Inter Bold';
	font-size: 1.125rem;
	line-height: 1.185rem;
	text-align: ${({ align }) => (align ? align : 'center')};
	color: ${({ theme }) => theme.colors.white};
	margin: ${({ theme }) => theme.spacings.tiny};
`;

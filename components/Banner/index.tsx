import styled from 'styled-components';

export const StyledBanner = styled.div`
	background: ${({ theme }) => theme.colors.gradients.orange};
	width: 100%;
	font-family: 'GT America';
	font-size: 1.14rem;
	font-weight: 700;
	padding: ${({ theme }) => theme.spacings.tiny};
	color: ${({ theme }) => theme.colors.black}; ;
`;

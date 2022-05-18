import { Colors, Flex, theme } from 'components/old-ui';
import styled from 'styled-components';

export const Banner = styled(Flex)<{
	gradientColor?: keyof typeof theme.colors.gradients;
	color?: Colors;
}>`
	background: ${({ theme, gradientColor, color }) => {
		if (gradientColor) return theme.colors.gradients[gradientColor];
		if (color) return theme.colors[color];
	}};
	width: 100%;
	padding: ${({ theme }) => theme.spacings.tiny};
	color: ${({ theme }) => theme.colors.black};
	position: absolute;
	top: 0px;
`;

export const BannerText = styled.h3`
	font-family: 'GT America Mono';
	font-size: 1.16rem;
	font-weight: 700;
	margin-right: 10px;
`;

export const TimeWrapper = styled(Flex)`
	border-radius: 5px;
	color: white;
	padding: 10px 20px;
	margin-right: 10px;
	> * {
		margin: 0px ${({ theme }) => theme.spacings.tiny};
	}
`;

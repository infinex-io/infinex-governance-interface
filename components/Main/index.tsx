import { Spotlight } from '@synthetixio/ui';
import { PropsWithChildren } from 'react';
import styled from 'styled-components';

export default function Main({ children }: PropsWithChildren<{}>) {
	return (
		<StyledMain>
			<StyledSpotlight>{children}</StyledSpotlight>
		</StyledMain>
	);
}
const StyledMain = styled.main`
	background-image: url('/images/landing-page-background.svg');
	background-color: ${({ theme }) => theme.colors.backgroundColor};
	color: ${({ theme }) => theme.colors.white};
`;

const StyledSpotlight = styled(Spotlight)`
	min-width: 100%;
`;

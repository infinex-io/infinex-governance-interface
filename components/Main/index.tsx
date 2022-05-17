import { Spotlight } from 'components/old-ui';
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
	background-color: ${({ theme }) => theme.colors.backgroundColor};
	color: ${({ theme }) => theme.colors.white};
	min-height: 99vh;
`;

const StyledSpotlight = styled(Spotlight)`
	min-width: 100%;
	padding-top: 50px;
	min-height: 100vh;
`;

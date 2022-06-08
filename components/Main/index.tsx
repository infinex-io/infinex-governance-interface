import { Spotlight } from 'components/old-ui';
import { PropsWithChildren } from 'react';
import styled from 'styled-components';

export default function Main({ children }: PropsWithChildren<{}>) {
	return (
		<main className="bg-dark-blue text-white min-height-[90vh]">
			<StyledSpotlight>{children}</StyledSpotlight>
		</main>
	);
}

const StyledSpotlight = styled(Spotlight)`
	min-width: 100%;
	padding-top: 50px;
	min-height: 100vh;
`;

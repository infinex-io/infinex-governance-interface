import { Button, Spotlight } from '@synthetixio/ui';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { DeployedModules } from 'containers/Modules/Modules';

import Councils from './Councils';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import Election from './Election';

// @ANDY TESTING SPACE
import Connector from 'containers/Connector';
import useUserNonceQuery from 'queries/boardroom/useUserNonceQuery';
import useSignMessageMutation from 'mutations/boardroom/useSignMessageMutation';
import { useCallback } from 'react';

export default function Dashboard() {
	const { t } = useTranslation();
	const currentPeriodQuery = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);

	// const { walletAddress } = Connector.useContainer();

	const signMessageMutation = useSignMessageMutation();

	const handleSignIn = useCallback(async () => {
		signMessageMutation.mutate();
	}, [signMessageMutation]);

	return (
		<>
			{currentPeriodQuery.data?.currentPeriod === '1' && (
				<StyledBanner>{t('dashboard.banner.nominate')}</StyledBanner>
			)}
			<Election />
			<Councils />
			<Button onClick={handleSignIn} text="sign in" />
		</>
	);
}

const StyledBanner = styled.div`
	background: ${({ theme }) => theme.colors.gradients.orange};
	width: 100%;
	font-family: 'GT America';
	font-size: 1.14rem;
	font-weight: 700;
	color: ${({ theme }) => theme.colors.black}; ;
`;

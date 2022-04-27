import { useCallback } from 'react';

import { Button, Spotlight } from '@synthetixio/ui';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { DeployedModules } from 'containers/Modules/Modules';

import Councils from './Councils';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import Election from './Election';

// @ANDY TESTING SPACE
import useSignInMutation from 'mutations/boardroom/useSignInMutation';
import useSignOutMutation from 'mutations/boardroom/useSignOutMutation';

export default function Dashboard() {
	const { t } = useTranslation();
	const currentPeriodQuery = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);

	// @ANDY TESTING SPACE

	const signInMutation = useSignInMutation();
	const signOutMutation = useSignOutMutation();

	const handleSignIn = useCallback(async () => {
		signInMutation.mutate();
	}, [signInMutation]);

	const handleSignOut = useCallback(async () => {
		signOutMutation.mutate();
	}, [signOutMutation]);

	///

	return (
		<>
			{currentPeriodQuery.data?.currentPeriod === '1' && (
				<StyledBanner>{t('dashboard.banner.nominate')}</StyledBanner>
			)}
			<Election />
			<Councils />
			<Button onClick={handleSignIn} text="sign in" />
			<Button onClick={handleSignOut} text="sign out" />
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

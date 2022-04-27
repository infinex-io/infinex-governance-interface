import { Button, Spotlight } from '@synthetixio/ui';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { DeployedModules } from 'containers/Modules/Modules';

import Councils from './Councils';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import Election from './Election';

// @ANDY TESTING SPACE
import Connector from 'containers/Connector';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import { useState } from 'react';
import useUpdateUserDetailsMutation from 'mutations/boardroom/useUpdateUserDetailsMutation';

export default function Dashboard() {
	const { t } = useTranslation();
	const currentPeriodQuery = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);

	// @ANDY TESTING SPACE

	const [username, setUsername] = useState<string>('');

	const { boardroomSignIn, boardroomSignOut, uuid } = Connector.useContainer();

	const userDetailsQuery = useUserDetailsQuery();

	const updateUserDetailsMutation = useUpdateUserDetailsMutation();

	const handleUpdateProfileUrl = async () => {
		if (userDetailsQuery.data) {
			updateUserDetailsMutation.mutate({ ...userDetailsQuery.data });
		}
	};

	///

	return (
		<>
			{currentPeriodQuery.data?.currentPeriod === '1' && (
				<StyledBanner>{t('dashboard.banner.nominate')}</StyledBanner>
			)}
			<Election />
			<Councils />

			<StyledParagraph>--------</StyledParagraph>
			<StyledParagraph>{uuid}</StyledParagraph>

			<StyledParagraph>{userDetailsQuery.data?.username}</StyledParagraph>

			<input
				value={username}
				onChange={(e) => {
					setUsername(e.target.value);
				}}
			/>

			<Button onClick={handleUpdateProfileUrl} text="submit username" />

			<StyledParagraph>--------</StyledParagraph>

			<Button onClick={boardroomSignIn} text="sign in" />
			<Button onClick={boardroomSignOut} text="sign out" />
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

// @ANDY TESTING SPACE

const StyledParagraph = styled.div`
	font-size: 32px;
	color: white;
	text-align: center;
	margin: 24px 0px;
`;
//

import { Button, Flex } from '@synthetixio/ui';
import CouncilsCarousel from 'components/CouncilsCarousel';
import { DeployedModules } from 'containers/Modules/Modules';
import { useRouter } from 'next/router';
import useCouncilMembersQuery from 'queries/members/useCouncilMembersQuery';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function ElectedCouncil() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const spartanMembersQuery = useCouncilMembersQuery(DeployedModules.SPARTAN_COUNCIL);
	const ambassadorMembersQuery = useCouncilMembersQuery(DeployedModules.AMBASSADOR_COUNCIL);
	const grantsMembersQuery = useCouncilMembersQuery(DeployedModules.GRANTS_COUNCIL);
	const treasuryMembersQuery = useCouncilMembersQuery(DeployedModules.TREASURY_COUNCIL);

	const spartanMembers = spartanMembersQuery.isSuccess && spartanMembersQuery.data;
	const ambassadorMembers = ambassadorMembersQuery.isSuccess && ambassadorMembersQuery.data;
	const grantsMembers = grantsMembersQuery.isSuccess && grantsMembersQuery.data;
	const treasuryMembers = treasuryMembersQuery.isSuccess && treasuryMembersQuery.data;

	return (
		<Flex direction="column" alignItems="center">
			<StyledCouncilHeader>{t('landing-pages.nomination.elected-members')}</StyledCouncilHeader>
			{spartanMembers && ambassadorMembers && grantsMembers && treasuryMembers && (
				<CouncilsCarousel
					members={{ spartanMembers, ambassadorMembers, grantsMembers, treasuryMembers }}
				/>
			)}
			<StyledButton
				onClick={() => {
					push({ pathname: '/elections' });
				}}
				variant="primary"
				size="medium"
			>
				{t('landing-pages.nomination.view-all-members')}
			</StyledButton>
		</Flex>
	);
}

const StyledCouncilHeader = styled.h1`
	font-family: 'Inter Bold';
	font-size: 3.66rem;
`;

const StyledButton = styled(Button)`
	margin: 50px 0px;
	max-width: 120px;
`;

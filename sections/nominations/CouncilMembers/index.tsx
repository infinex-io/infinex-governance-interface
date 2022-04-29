import { ArrowDropdownLeftIcon, Card, IconButton, Flex } from '@synthetixio/ui';
import { DeployedModules } from 'containers/Modules/Modules';
import { useRouter } from 'next/router';
import useCouncilMembersQuery from 'queries/members/useCouncilMembersQuery';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function CouncilMembersSection() {
	const { t } = useTranslation();
	const { query, push } = useRouter();
	// TODO @DEV query members
	const { data } = useCouncilMembersQuery(DeployedModules.SPARTAN_COUNCIL);
	console.log(data);
	return (
		<Flex direction="column" alignItems="center">
			<StyledHeadline>
				<IconButton onClick={() => push({ pathname: '/elections' })} rounded active>
					<ArrowDropdownLeftIcon active={true} />
				</IconButton>
				{t('council-members.headline', { council: query?.council ? query.council : '' })}
				<Flex wrap={true}>
					{data?.map((member) => (
						<StyledMemberCard withBackgroundColor="darkBlue">{member}</StyledMemberCard>
					))}
				</Flex>
			</StyledHeadline>
		</Flex>
	);
}

const StyledHeadline = styled.h1`
	font-family: 'Inter';
	font-size: 3.33rem;
`;

const StyledMemberCard = styled(Card)`
	margin: ${({ theme }) => theme.spacings.medium};
`;

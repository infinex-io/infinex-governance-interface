import { ArrowDropdownLeftIcon, Card, IconButton, Flex } from '@synthetixio/ui';
import VoteModal from 'components/Modals/Vote';
import Modal from 'containers/Modal';
import { DeployedModules } from 'containers/Modules/Modules';
import { useRouter } from 'next/router';
import useCouncilMembersQuery from 'queries/members/useCouncilMembersQuery';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function CouncilMembersSection() {
	const { t } = useTranslation();
	const { query, push } = useRouter();
	const { data } = useCouncilMembersQuery(DeployedModules.SPARTAN_COUNCIL);
	const { setContent, setIsOpen } = Modal.useContainer();
	return (
		<StyledFlex direction="column" alignItems="center">
			<StyledHeadline>
				<IconButton onClick={() => push({ pathname: '/elections' })} rounded active>
					<ArrowDropdownLeftIcon active={true} />
				</IconButton>
				{t('council-members.headline', { council: query?.council ? query.council : '' })}
				<Flex wrap={true}>
					{data?.map((member) => (
						<StyledMemberCard
							withBackgroundColor="darkBlue"
							onClick={() => {
								setContent(<VoteModal candidateInformation={{ address: member }} />);
								setIsOpen(true);
							}}
						>
							{member}
						</StyledMemberCard>
					))}
				</Flex>
			</StyledHeadline>
		</StyledFlex>
	);
}

const StyledFlex = styled(Flex)`
	min-height: 100vh;
`;

const StyledHeadline = styled.h1`
	font-family: 'Inter';
	font-size: 3.33rem;
`;

const StyledMemberCard = styled(Card)`
	margin: ${({ theme }) => theme.spacings.medium};
	cursor: pointer;
`;

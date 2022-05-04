import {
	ArrowDropdownLeftIcon,
	Card,
	IconButton,
	Flex,
	Button,
	ThreeDotsKebabIcon,
	Dropdown,
} from '@synthetixio/ui';
import { H1 } from 'components/Headlines/H1';
import Connector from 'containers/Connector';
import { DeployedModules } from 'containers/Modules/Modules';
import { useRouter } from 'next/router';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { capitalizeString } from 'utils/capitalize';

export default function CouncilNominees() {
	const { t } = useTranslation();
	const { query, push } = useRouter();
	const { data } = useNomineesQuery(DeployedModules.SPARTAN_COUNCIL);
	const { walletAddress } = Connector.useContainer();
	const [dropDownIsOpen, setDropDownIsOpen] = useState(false);
	return (
		<>
			<StyledFlex direction="column" alignItems="center">
				<StyledButtonWrapper alignItems="center">
					<IconButton onClick={() => push({ pathname: '/elections' })} size="tiny" rounded active>
						<ArrowDropdownLeftIcon active={true} />
					</IconButton>
					<StyledButtonText>{t('elections.nomination.members.back')}</StyledButtonText>
				</StyledButtonWrapper>
				<StyledHeadline>
					{t('elections.nomination.members.headline', {
						council: query?.council ? capitalizeString(query.council.toString()) : '',
					})}
				</StyledHeadline>
				<Flex wrap={true}>
					{/* TODO @DEV uncomment once we got some data */}
					{/* 				{data?.map((member) => ( */}
					<StyledMemberCard withBackgroundColor="purple" onClick={() => {}}>
						<StyledMemberCardContent className="darker-60">
							0x0000...0000
							<Flex alignItems="center">
								<Button
									variant="secondary"
									onClick={() => {
										console.log('route to member view page with address as query in the url');
									}}
								>
									{t('elections.nomination.members.view-nominee')}
								</Button>
								<StyledOptionsCard
									withBackgroundColor="lightBlue"
									onClick={() => setDropDownIsOpen(!dropDownIsOpen)}
								>
									<ThreeDotsKebabIcon active />
									{dropDownIsOpen && <StyledDropdown elements={[<div>test</div>]} />}
								</StyledOptionsCard>
							</Flex>
						</StyledMemberCardContent>
					</StyledMemberCard>
					{/* ))} */}
				</Flex>
			</StyledFlex>
		</>
	);
}

const StyledFlex = styled(Flex)`
	min-height: 100vh;
	position: relative;
`;

const StyledButtonWrapper = styled(Flex)`
	position: absolute;
	top: 50px;
	left: 50px;
`;

const StyledButtonText = styled.span`
	color: ${({ theme }) => theme.colors.lightBlue};
	font-family: ${({ theme }) => theme.fonts.interBold};
	font-size: 1.16rem;
	margin-left: 1rem;
`;

const StyledHeadline = styled(H1)`
	margin-top: 64px;
`;

const StyledMemberCard = styled(Card)`
	margin: ${({ theme }) => theme.spacings.medium};
`;

const StyledMemberCardContent = styled.div`
	max-width: 206px;
	max-height: 280px;
	min-width: 206px;
	min-height: 280px;
	padding: 16px;
`;

const StyledOptionsCard = styled(Card)`
	position: relative;
	cursor: pointer;
	max-width: 25px;
	height: 100%;
	margin: ${({ theme }) => theme.spacings.tiniest};
`;

const StyledDropdown = styled(Dropdown)`
	position: absolute;
	bottom: 0px;
	left: 50px;
`;

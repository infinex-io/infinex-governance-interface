import { ArrowRightIcon, Flex, IconButton } from '@synthetixio/ui';
import { StyledBanner } from 'components/Banner';
import NominateModal from 'components/Modals/Nominate';
import RemainingTime from 'components/RemainingTime';
import Modal from 'containers/Modal';
import { DeployedModules } from 'containers/Modules/Modules';

import useCurrentEpochDatesQuery from 'queries/epochs/useCurrentEpochDatesQuery';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { parseRemainingTime } from 'utils/time';

export default function NominateSelfBanner() {
	const { setIsOpen, setContent } = Modal.useContainer();
	const { t } = useTranslation();
	const { data } = useCurrentEpochDatesQuery(DeployedModules.SPARTAN_COUNCIL);
	const remainingTime = data?.epochStartDate && parseRemainingTime(data.epochStartDate);
	return (
		<>
			<StyledBanner>
				<Flex justifyContent="center">
					<StyledBannerText>{t('dashboard.banner.nominate')}</StyledBannerText>
					<StyledTimeWrapper alignItems="center" className="darker-60">
						{t('dashboard.banner.closes')}
						{remainingTime && <RemainingTime>{remainingTime}</RemainingTime>}
					</StyledTimeWrapper>
					<IconButton
						onClick={() => {
							setContent(<NominateModal />);
							setIsOpen(true);
						}}
						size="tiny"
						active
						rounded
					>
						{t('dashboard.banner.self')}
						<ArrowRightIcon />
					</IconButton>
				</Flex>
			</StyledBanner>
		</>
	);
}

const StyledBannerText = styled.h3`
	font-family: 'GT America Mono';
	font-size: 1.16rem;
	font-weight: 700;
	margin-right: 10px;
`;

const StyledTimeWrapper = styled(Flex)`
	border-radius: 5px;
	color: white;
	padding: 10px 20px;
	margin-right: 10px;
	> * {
		margin: 0px ${({ theme }) => theme.spacings.tiny};
	}
`;

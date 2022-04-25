import Flex from 'components/Flex';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function CouncilMembersSection() {
	const { t } = useTranslation();
	return (
		<Flex direction="column" alignItems="center">
			<StyledHeadline>{t('council-members.headline')}</StyledHeadline>
		</Flex>
	);
}

const StyledHeadline = styled.h1``;

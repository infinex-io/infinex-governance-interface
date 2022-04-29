import Flex from 'components/Flex';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function ProfileSection({ walletAddress }: { walletAddress: string }) {
	const { t } = useTranslation();

	return (
		<Flex direction="column" alignItems="center">
			<StyledHeadline>{walletAddress}</StyledHeadline>
		</Flex>
	);
}

const StyledHeadline = styled.h1``;

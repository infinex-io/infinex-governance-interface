import { Button } from 'components/old-ui';
import { useModalContext } from 'containers/Modal';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import BaseModal from '../BaseModal';

interface VoteModalProps {
	candidateInformation: {
		name?: string;
		address: string;
	};
}

export default function VoteModal({ candidateInformation }: VoteModalProps) {
	const { t } = useTranslation();
	const { setIsOpen } = useModalContext();
	const { push } = useRouter();
	return (
		<BaseModal headline={t('modals.vote.headline')}>
			{candidateInformation.address}
			<StyledSubmitButton
				onClick={() => {
					setIsOpen(false);
					// TODO @DEV decide the route
					push({ pathname: 'elections/members/...' });
				}}
				variant="primary"
			>
				{t('modals.vote.submit')}
			</StyledSubmitButton>
			<StyledProfileButton variant="secondary" onClick={() => {}}>
				{t('modals.vote.profile')}
			</StyledProfileButton>
		</BaseModal>
	);
}

const StyledSubmitButton = styled(Button)`
	min-width: 280px;
	margin: ${({ theme }) => theme.spacings.medium};
	max-width: 240px;
`;

const StyledProfileButton = styled(Button)`
	min-width: 280px;
	max-width: 240px;
`;

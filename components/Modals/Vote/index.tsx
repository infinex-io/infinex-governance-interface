import { Button } from '@synthetixio/ui';
import Modal from 'containers/Modal';
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
	const { setIsOpen } = Modal.useContainer();
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
				text={t('modals.vote.submit')}
			/>
			<StyledProfileButton text={t('modals.vote.profile')} variant="secondary" onClick={() => {}} />
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

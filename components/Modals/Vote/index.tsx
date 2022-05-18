import { Button } from 'components/old-ui';
import Modal from 'containers/Modal';
import { useRouter } from 'next/router';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import BaseModal from '../BaseModal';

interface VoteModalProps {
	address: string;
	council: string;
}

export default function VoteModal({ address, council }: VoteModalProps) {
	const { data } = useUserDetailsQuery(address);
	const { t } = useTranslation();
	const { setIsOpen } = Modal.useContainer();
	const { push } = useRouter();
	return (
		<BaseModal headline={t('modals.vote.headline', { council })}>
			{data && data.ens}
			<div className="bg-primary">test</div>
			<StyledSubmitButton
				onClick={() => {
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
